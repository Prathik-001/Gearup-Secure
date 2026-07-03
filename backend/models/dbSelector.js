import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

let isConnected = false;
let useMock = false;

// We set a 3-second connection timeout
export const connectDb = async (uri) => {
  try {
    console.log("Connecting to MongoDB database...");
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000 // 3 seconds timeout
    });
    isConnected = true;
    console.log("Connected to MongoDB database successfully.");
  } catch (err) {
    console.error("MongoDB database connection failed:", err.message);
    console.log("⚠️ Falling back to local file-based database (mock_db/) for offline development.");
    useMock = true;
  }
};

class MockQuery {
  constructor(items) {
    this.items = items;
  }
  sort(fn) {
    // Simple sort for newest first
    this.items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return this;
  }
  then(resolve) {
    return Promise.resolve(resolve(this.items));
  }
}

class MockModel {
  constructor(name, schema, data = {}) {
    this._name = name;
    this._schema = schema;
    Object.assign(this, data);
    
    // Copy default schema values if not specified
    if (schema && schema.obj) {
      Object.keys(schema.obj).forEach(key => {
        if (this[key] === undefined) {
          const field = schema.obj[key];
          if (field && field.default !== undefined) {
            this[key] = typeof field.default === 'function' ? field.default() : field.default;
          }
        }
      });
    }

    if (!this._id) {
      this._id = 'mock_' + Math.random().toString(36).substr(2, 9);
      this.createdAt = new Date().toISOString();
      this.updatedAt = new Date().toISOString();
    }

    // Bind schema methods
    if (schema && schema.methods) {
      Object.keys(schema.methods).forEach(methodName => {
        this[methodName] = schema.methods[methodName].bind(this);
      });
    }
  }

  static getFilePath(name) {
    const dir = path.join(process.cwd(), 'mock_db');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    return path.join(dir, `${name.toLowerCase()}s.json`);
  }

  static readData(name) {
    const file = this.getFilePath(name);
    if (!fs.existsSync(file)) return [];
    try {
      return JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch {
      return [];
    }
  }

  static writeData(name, data) {
    const file = this.getFilePath(name);
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  }

  async save() {
    const items = MockModel.readData(this._name);
    
    // Hash password if User model
    if (this._name === 'User' && this.password && !this.password.startsWith('$2a$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    this.updatedAt = new Date().toISOString();
    const existingIndex = items.findIndex(item => item._id === this._id);
    const plainData = { ...this };
    delete plainData._name;
    delete plainData._schema;

    // Convert methods to clean JSON serializable representation
    Object.keys(plainData).forEach(key => {
      if (typeof plainData[key] === 'function') delete plainData[key];
    });

    if (existingIndex > -1) {
      items[existingIndex] = plainData;
    } else {
      items.push(plainData);
    }
    MockModel.writeData(this._name, items);
    return this;
  }
}

// Factory to create model class with dynamic switching
export const getModel = (name, schema) => {
  const mongooseModel = mongoose.model(name, schema);

  const mockHandler = {
    // Constructor wrapper: returns mongoose instance or MockModel instance
    construct(target, args) {
      if (!useMock) {
        return new mongooseModel(...args);
      }
      return new MockModel(name, schema, args[0]);
    },
    // Static methods wrapper
    get(target, prop) {
      if (!useMock) {
        return mongooseModel[prop];
      }

      // Implement Mock DB static queries
      if (prop === 'findOne') {
        return async (query) => {
          const items = MockModel.readData(name);
          const matched = items.find(item => matches(item, query));
          return matched ? new MockModel(name, schema, matched) : null;
        };
      }
      if (prop === 'find') {
        return (query) => {
          const items = MockModel.readData(name);
          const filtered = query ? items.filter(item => matches(item, query)) : items;
          const mapped = filtered.map(item => new MockModel(name, schema, item));
          return new MockQuery(mapped);
        };
      }
      if (prop === 'findById') {
        return async (id) => {
          const items = MockModel.readData(name);
          const matched = items.find(item => item._id === id);
          return matched ? new MockModel(name, schema, matched) : null;
        };
      }
      if (prop === 'countDocuments') {
        return async (query) => {
          const items = MockModel.readData(name);
          const filtered = query ? items.filter(item => matches(item, query)) : items;
          return filtered.length;
        };
      }
      if (prop === 'findByIdAndUpdate') {
        return async (id, updateData, options = {}) => {
          const items = MockModel.readData(name);
          const index = items.findIndex(item => item._id === id);
          if (index === -1) return null;

          const updatedItem = { ...items[index] };
          
          // Apply $set or regular updates
          const fields = updateData.$set || updateData;
          Object.assign(updatedItem, fields);
          updatedItem.updatedAt = new Date().toISOString();

          items[index] = updatedItem;
          MockModel.writeData(name, items);
          return new MockModel(name, schema, updatedItem);
        };
      }
      if (prop === 'findByIdAndDelete') {
        return async (id) => {
          const items = MockModel.readData(name);
          const index = items.findIndex(item => item._id === id);
          if (index === -1) return null;
          const removed = items.splice(index, 1)[0];
          MockModel.writeData(name, items);
          return new MockModel(name, schema, removed);
        };
      }

      return mongooseModel[prop];
    }
  };

  return new Proxy(mongooseModel, mockHandler);
};

function matches(item, query) {
  if (!query) return true;
  return Object.keys(query).every(key => {
    const val = query[key];
    if (val && typeof val === 'object') {
      return JSON.stringify(item[key]) === JSON.stringify(val);
    }
    return item[key] === val;
  });
}
