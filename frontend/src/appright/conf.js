export class Service {
  baseUrl = 'http://localhost:5000/api';
  
  // Expose a dummy client object to prevent runtime errors if components access service.client
  client = {
    setEndpoint: () => this,
    setProject: () => this,
  };

  // Helper for requests
  getHeaders(withAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (withAuth) {
      const token = localStorage.getItem('gearup_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  // Upload user profile data (Signup step 2)
  async uploadUserData(id, { Name, Email, Phone, State, District, Pincode }) {
    try {
      const res = await fetch(`${this.baseUrl}/auth/profile-update`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify({ state: State, district: District, pincode: String(Pincode) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile.');
      return data;
    } catch (error) {
      console.error("Service :: uploadUserData :: error", error);
      throw error;
    }
  }

  // Car upload database
  async uploadData(
    imageId,
    vehicleName,
    vehicleType,
    fuelType,
    range,
    mileage,
    seats,
    luggageCapacity,
    rentPrice,
    airConditioning,
    gpsNavigation,
    bluetooth,
    sunroof,
    transmissionType,
    numberOfDoors,
    conditions,
    rating,
    userId,
    status
  ) {
    try {
      const res = await fetch(`${this.baseUrl}/vehicles`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify({
          imageId,
          vehicleName,
          vehicleType,
          fuelType,
          range,
          mileage,
          seats,
          luggageCapacity,
          rentPrice,
          airConditioning,
          gpsNavigation,
          bluetooth,
          sunroof,
          transmissionType,
          numberOfDoors,
          conditions,
          rating,
          isBike: false,
          status
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create car post.');
      return data;
    } catch (error) {
      console.error("Service :: uploadData :: error", error);
      return false;
    }
  }

  // Bike database
  async uploadBikeData(
    imageId,
    vehicleName,
    vehicleType,
    fuelType,
    range,
    mileage,
    cc,
    rentPrice,
    abs,
    gpsNavigation,
    topBox,
    conditions,
    rating,
    userId,
    status
  ) {
    try {
      const res = await fetch(`${this.baseUrl}/vehicles`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify({
          imageId,
          vehicleName,
          vehicleType,
          fuelType,
          range,
          mileage,
          cc,
          rentPrice,
          abs,
          gpsNavigation,
          topBox,
          conditions,
          rating,
          isBike: true,
          status
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create bike post.');
      return data;
    } catch (error) {
      console.error("Service :: uploadBikeData :: error", error);
      return false;
    }
  }

  // User Bookings
  async bookingData(
    vehicleName,
    vehicleType,
    fuelType,
    rentPrice,
    totalPrice,
    startDate,
    endDate,
    location,
    vehicleId,
    cradID,
    month,
    year,
    bookingStatus,
    userId
  ) {
    try {
      const res = await fetch(`${this.baseUrl}/bookings`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify({
          vehicleName,
          vehicleType,
          fuelType,
          rentPrice,
          totalPrice,
          startDate,
          endDate,
          location,
          vehicleId,
          cradID,
          month,
          year,
          bookingStatus
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to complete booking.');
      return data;
    } catch (error) {
      console.error("Service :: bookingData :: error", error);
      return false;
    }
  }

  // HELPLINE data
  async helpline(FullName, Email, phone, subject, message, userId) {
    try {
      const res = await fetch(`${this.baseUrl}/helpline`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify({ FullName, Email, phone, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit ticket.');
      return data;
    } catch (error) {
      console.error("Service :: helpline :: error", error);
      return false;
    }
  }

  // Fetch all users (Admin only)
  async getAllUsersData() {
    try {
      const res = await fetch(`${this.baseUrl}/auth/users`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });
      if (!res.ok) throw new Error('Failed to fetch users.');
      return await res.json();
    } catch (error) {
      console.error("Service :: getAllUsersData :: error", error);
      return false;
    }
  }

  // Fetch all cars
  async getAllCarsData() {
    try {
      const res = await fetch(`${this.baseUrl}/vehicles/cars`, {
        method: 'GET',
        headers: this.getHeaders(false),
      });
      if (!res.ok) throw new Error('Failed to fetch cars.');
      return await res.json();
    } catch (error) {
      console.error("Service :: getAllCarsData :: error", error);
      return false;
    }
  }

  // Fetch all bikes
  async getAllBikesData() {
    try {
      const res = await fetch(`${this.baseUrl}/vehicles/bikes`, {
        method: 'GET',
        headers: this.getHeaders(false),
      });
      if (!res.ok) throw new Error('Failed to fetch bikes.');
      return await res.json();
    } catch (error) {
      console.error("Service :: getAllBikesData :: error", error);
      return false;
    }
  }

  // Fetch bookings (Filtered by owner/admin in backend)
  async getAllBookingsData() {
    try {
      const res = await fetch(`${this.baseUrl}/bookings`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });
      if (!res.ok) throw new Error('Failed to fetch bookings.');
      return await res.json();
    } catch (error) {
      console.error("Service :: getAllBookingsData :: error", error);
      return false;
    }
  }

  // Fetch all helpline tickets (Admin only)
  async getAllHelpline() {
    try {
      const res = await fetch(`${this.baseUrl}/helpline`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });
      if (!res.ok) throw new Error('Failed to fetch helpline entries.');
      return await res.json();
    } catch (error) {
      console.error("Service :: getAllHelpline :: error", error);
      return false;
    }
  }

  async getCarInfo(id) {
    try {
      const res = await fetch(`${this.baseUrl}/vehicles/${id}`, {
        method: 'GET',
        headers: this.getHeaders(false),
      });
      if (!res.ok) throw new Error('Failed to fetch car.');
      return await res.json();
    } catch (error) {
      console.error("Service :: getCarInfo :: error", error);
      return false;
    }
  }

  async getBikeInfo(id) {
    try {
      const res = await fetch(`${this.baseUrl}/vehicles/${id}`, {
        method: 'GET',
        headers: this.getHeaders(false),
      });
      if (!res.ok) throw new Error('Failed to fetch bike.');
      return await res.json();
    } catch (error) {
      console.error("Service :: getBikeInfo :: error", error);
      return false;
    }
  }

  async getBookingInfo(id) {
    try {
      const res = await fetch(`${this.baseUrl}/bookings/${id}`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });
      if (!res.ok) throw new Error('Failed to fetch booking.');
      return await res.json();
    } catch (error) {
      console.error("Service :: getBookingInfo :: error", error);
      return false;
    }
  }

  // Delete a Helpline document (Admin only)
  async deleteHelpline(documentId) {
    try {
      const res = await fetch(`${this.baseUrl}/helpline/${documentId}`, {
        method: 'DELETE',
        headers: this.getHeaders(true),
      });
      if (!res.ok) throw new Error('Failed to delete helpline ticket.');
      return await res.json();
    } catch (error) {
      console.error("Service :: deleteHelpline :: error", error);
      throw error;
    }
  }

  // Delete a user document (Admin only)
  async deleteUser(documentId) {
    try {
      const res = await fetch(`${this.baseUrl}/auth/users/${documentId}`, {
        method: 'DELETE',
        headers: this.getHeaders(true),
      });
      if (!res.ok) throw new Error('Failed to delete user.');
      return await res.json();
    } catch (error) {
      console.error("Service :: deleteUser :: error", error);
      throw error;
    }
  }

  // Delete a car document
  async deleteCar(documentId) {
    try {
      const res = await fetch(`${this.baseUrl}/vehicles/${documentId}`, {
        method: 'DELETE',
        headers: this.getHeaders(true),
      });
      if (!res.ok) throw new Error('Failed to delete car listing.');
      return await res.json();
    } catch (error) {
      console.error("Service :: deleteCar :: error", error);
      throw error;
    }
  }

  // Delete a bike document
  async deleteBike(documentId) {
    try {
      const res = await fetch(`${this.baseUrl}/vehicles/${documentId}`, {
        method: 'DELETE',
        headers: this.getHeaders(true),
      });
      if (!res.ok) throw new Error('Failed to delete bike listing.');
      return await res.json();
    } catch (error) {
      console.error("Service :: deleteBike :: error", error);
      throw error;
    }
  }

  // Delete a Booking document
  async deleteBooking(documentId) {
    try {
      const res = await fetch(`${this.baseUrl}/bookings/${documentId}`, {
        method: 'DELETE',
        headers: this.getHeaders(true),
      });
      if (!res.ok) throw new Error('Failed to cancel booking.');
      return await res.json();
    } catch (error) {
      console.error("Service :: deleteBooking :: error", error);
      throw error;
    }
  }

  // Search cars
  async searchCars(query) {
    try {
      const res = await fetch(`${this.baseUrl}/vehicles/search/cars?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: this.getHeaders(false),
      });
      if (!res.ok) throw new Error('Failed to search cars.');
      return await res.json();
    } catch (error) {
      console.error("Service :: searchCars :: error", error);
      return false;
    }
  }

  // Search bikes
  async searcBikes(query) {
    try {
      const res = await fetch(`${this.baseUrl}/vehicles/search/bikes?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: this.getHeaders(false),
      });
      if (!res.ok) throw new Error('Failed to search bikes.');
      return await res.json();
    } catch (error) {
      console.error("Service :: searcBikes :: error", error);
      return false;
    }
  }

  // File upload service (Multer)
  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('gearup_token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${this.baseUrl}/vehicles/upload-image`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Image upload failed.');
      return data; // Returns { $id, fileId }
    } catch (error) {
      console.error("Service :: uploadFile :: error", error);
      return false;
    }
  }

  // Fetch user's listed vehicles
  async getUserVehicles(userId) {
    try {
      const res = await fetch(`${this.baseUrl}/vehicles/user/${userId}`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });
      if (!res.ok) throw new Error('Failed to fetch user vehicles.');
      return await res.json();
    } catch (error) {
      console.error("Service :: getUserVehicles :: error", error);
      return [];
    }
  }

  // Toggle sharing status (active/inactive)
  async toggleVehicleStatus(vehicleId, status) {
    try {
      const res = await fetch(`${this.baseUrl}/vehicles/${vehicleId}/status`, {
        method: 'PUT',
        headers: this.getHeaders(true),
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update vehicle status.');
      return data;
    } catch (error) {
      console.error("Service :: toggleVehicleStatus :: error", error);
      throw error;
    }
  }

  // Update vehicle details (specs/photo)
  async updateVehicle(vehicleId, data) {
    try {
      const res = await fetch(`${this.baseUrl}/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: this.getHeaders(true),
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to update vehicle details.');
      return resData;
    } catch (error) {
      console.error("Service :: updateVehicle :: error", error);
      throw error;
    }
  }

  // Get file preview URL mapping
  getFilePreiview(fileId) {
    if (!fileId) return '';
    return `${this.baseUrl}/files/preview/${fileId}`;
  }

  // 🔒 Blockchain Ledger Integration endpoints
  async getBlockchainBlocks() {
    try {
      const res = await fetch(`${this.baseUrl}/blockchain/blocks`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });
      if (!res.ok) throw new Error('Failed to fetch ledger blocks.');
      return await res.json();
    } catch (error) {
      console.error("Service :: getBlockchainBlocks :: error", error);
      return [];
    }
  }

  async validateBlockchain() {
    try {
      const res = await fetch(`${this.baseUrl}/blockchain/validate`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });
      if (!res.ok) throw new Error('Failed to validate blockchain ledger.');
      return await res.json();
    } catch (error) {
      console.error("Service :: validateBlockchain :: error", error);
      return { isValid: false, reason: "Verification server is offline." };
    }
  }
}

const service = new Service();
export default service;