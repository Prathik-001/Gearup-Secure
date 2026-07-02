import React from 'react';
import { Trash2 } from 'lucide-react';

const UserData = ({ user, onDelete }) => {
  return (
    <div className="">
      <div className="">
        <div className="bg-white rounded-lg shadow-sm p-4 flex hover:shadow-md transition-shadow">
          <div className="grid grid-cols-6 flex-grow gap-32">
            <div className="text-gray-900 font-medium">{user.name}</div>
            <div className="text-gray-600">{user.phone}</div>
            <div className="text-blue-400">{user.email}</div>
            <div className="text-gray-600">{user.state}</div>
            <div className="text-gray-600">{user.district}</div>
            <div className="text-gray-600">{user.pincode}</div>
          </div>
          <button
            onClick={() => onDelete(user.$id)}
            className="ml-4 p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            aria-label="Delete user"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserData;
