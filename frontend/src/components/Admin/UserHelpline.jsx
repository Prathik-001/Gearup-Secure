import { useState, useEffect } from "react";
import { FiSearch, FiTrash2, FiArchive, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { format } from "date-fns";
import service from "../../appright/conf";

const UserSubmissionList = ({ onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    service.getAllHelpline().then((data) => {
      const formatted = data.map((item) => ({
        id: item.$id,
        username: item.FullName,
        email: item.Email,
        phone: item.phone,
        subject: item.subject,
        message: item.message,
        date: new Date(item.$createdAt),
        status: "unread",
      }));
      setSubmissions(formatted);
    });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (id) => {
    onDelete(id); // propagate delete to parent (Admin Panel)
    setSubmissions(submissions.filter((sub) => sub.id !== id));
  };

  const handleArchive = (id) => {
    setSubmissions(
      submissions.map((sub) =>
        sub.id === id ? { ...sub, status: "archived" } : sub
      )
    );
  };

  const handleStatusToggle = (id) => {
    setSubmissions(
      submissions.map((sub) =>
        sub.id === id
          ? { ...sub, status: sub.status === "unread" ? "read" : "unread" }
          : sub
      )
    );
  };

  const filteredSubmissions = submissions
    .filter(
      (sub) =>
        sub.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") return b.date - a.date;
      if (sortBy === "name") return a.username.localeCompare(b.username);
      return 0;
    });

  return (
    <div className="bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search submissions..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <select
              className="w-full md:w-48 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FiAlertCircle className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500">No submissions found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg ${submission.status === "unread" ? "border-l-4 border-blue-500" : ""}`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {submission.username}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {format(submission.date, "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {submission.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span> {submission.phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Subject:</span> {submission.subject}
                    </p>
                  </div>
                  <div className="mb-4">
                    <p
                      className={`text-sm text-gray-600 ${expandedCard === submission.id ? "" : "line-clamp-2"}`}
                    >
                      {submission.message}
                    </p>
                    <button
                      className="text-sm text-blue-500 mt-2 hover:text-blue-600"
                      onClick={() =>
                        setExpandedCard(
                          expandedCard === submission.id ? null : submission.id
                        )
                      }
                    >
                      {expandedCard === submission.id ? "Show less" : "Read more"}
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex space-x-2">

                      <button
                        onClick={() => handleDelete(submission.id)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSubmissionList;
