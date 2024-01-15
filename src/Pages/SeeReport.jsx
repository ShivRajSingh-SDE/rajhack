import React, { useState, useEffect } from "react";
import axios from "axios";

const SeeReport = () => {
  const [formEntries, setFormEntries] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/form-entries");
        console.log("Fetched data:", response.data); // Log the retrieved data
        setFormEntries(response.data);
      } catch (error) {
        console.error("Error fetching form entries:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");

    if (userEmail) {
      fetch(`http://localhost:5000/users/${userEmail}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.roleadmin === "police") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, []);

  const handleStatusChange = async (e, entryId) => {
    try {
      const selectedStatus = e.target.value;

      const response = await axios.put(
        `http://localhost:5000/form-entries/${entryId}`,
        {
          status: selectedStatus,
        }
      );

      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error(`Failed to update status for entry ID ${entryId}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDescriptionChange = (entryId, newDescription) => {
    // Update the description in the component's state
    setFormEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry._id === entryId
          ? { ...entry, description: newDescription }
          : entry
      )
    );
  };

  const handleDescriptionSubmit = async (entryId, newDescription) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/form-entries/${entryId}`,
        {
          description: newDescription,
        }
      );

      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error(`Failed to update description for entry ID ${entryId}`);
      }
    } catch (error) {
      console.error("Error updating description:", error);
    }
  };

  const handleAttachmentPreview = (attachment) => {
    // Implement attachment preview logic here (e.g., open a modal or a new window)
    console.log("Previewing attachment:", attachment);
  };

  return (
    <div className="h-full mt-5">
      {isAdmin && (
        <div className="data justify-center items-center flex flex-col m-5">
          <h2 className="font-sans text-black text-4xl my-5 underline">
            Cyber Victims Report
          </h2>

          <table className="table-auto w-[100%]">
            <thead>
              <tr className="drop-shadow-xl rounded-xl shadow-2xl">
                <th className="border px-4 py-2">S.N</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Mobile Number</th>
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2">Message</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Attachment</th>
              </tr>
            </thead>
            <tbody>
              {formEntries.map((formEntry, index) => (
                <tr key={formEntry._id} className="bg-[#ffffff54]">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{formEntry.name}</td>
                  <td className="border px-4 py-2">{formEntry.mobileNumber}</td>
                  <td className="border px-4 py-2">{formEntry.position}</td>
                  <td className="border px-4 py-2">{formEntry.message}</td>
                  <td className="border px-4 py-2">
                    <select
                      className="bg-[#fffff] cursor-pointer justify-center items-center flex text-[black] drop-shadow-2xl shadow-2xl rounded-2xl p-2"
                      onChange={(e) => handleStatusChange(e, formEntry._id)}
                      value={formEntry.status}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Under Processing">Under Processing</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      className="bg-[#80808041] p-2 rounded-xl"
                      value={formEntry.description || ""}
                      onChange={(e) =>
                        handleDescriptionChange(formEntry._id, e.target.value)
                      }
                    />
                  </td>

                  <td className="border px-4 py-2">
                    {formEntry.attachments &&
                      formEntry.attachments.map(
                        (attachment, attachmentIndex) => (
                          <div key={attachmentIndex}>
                            {attachment.attachment && (
                              <a
                                href={`data:application/pdf;base64,${attachment.attachment}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[pink] p-3"
                                download={`Document_${attachmentIndex + 1}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                Download Document {attachmentIndex + 1}
                              </a>
                            )}
                            
                          </div>
                        )
                      )}
                  </td>

                  <td className="border px-4 py-2">
                    <button
                      className="bg-[#00ffff4b] hover:drop-shadow-2xl hover:bg-[#8080802a] p-2 rounded-2xl shadow-2xl"
                      onClick={() =>
                        handleDescriptionSubmit(
                          formEntry._id,
                          formEntry.description
                        )
                      }
                    >
                      Submit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SeeReport;
