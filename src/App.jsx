import React, { useEffect, useState } from "react";
import { supabase } from "./createClient";
import "./index.css"; // atau path yang sesuai ke file CSS Anda

// Component for managing employee data
const App = () => {
  // State variables for employee list and new employee data
  const [listKaryawan, setListKaryawan] = useState([]);
  const [newKaryawan, setNewKaryawan] = useState({
    nama: "",
    age: "",
  });
  // State untuk menyimpan data yang akan diedit
  const [editData, setEditData] = useState(null);
  // State untuk menampilkan atau menyembunyikan toast
  const [showToast, setShowToast] = useState(false);

  // Pagination variables
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listKaryawan.slice(indexOfFirstItem, indexOfLastItem);

  // Fetch employee data from the database on component mount
  useEffect(() => {
    fetchKaryawan();
  }, []);

  // Function to fetch employee data from the database
  async function fetchKaryawan() {
    const { data } = await supabase.from("karyawan").select("*");
    const formattedData = data.map((item) => {
      return {
        ...item,
        created_at: new Date(item.created_at).toLocaleString(),
      };
    });
    setListKaryawan(formattedData);
  }

  // Function to create a new employee
  async function createKaryawan(event) {
    event.preventDefault();
    await supabase
      .from("karyawan")
      .insert([{ nama: newKaryawan.nama, usia: newKaryawan.age }]);
    setNewKaryawan({ nama: "", age: "" });
    fetchKaryawan();
  }

  // Function to handle input changes for new employee data
  function handleChange(event) {
    setNewKaryawan((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }
  // Function to edit an employee data by id
  async function editKaryawan(id, updatedData) {
    await supabase.from("karyawan").update(updatedData).eq("id", id);
    fetchKaryawan();
  }
  // Function to delete an employee data by id
  async function deleteKaryawan(id) {
    await supabase.from("karyawan").delete().eq("id", id);
    fetchKaryawan(); // Refresh the karyawan list after deletion
  }

  // Function to edit employee data by id
  async function editKaryawan(id, updatedData) {
    await supabase.from("karyawan").update(updatedData).eq("id", id);
    fetchKaryawan(); // Refresh the karyawan list after editing
  }

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(listKaryawan.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Fungsi untuk menampilkan toast dan menetapkan data yang akan diedit
  const showEditToast = (data) => {
    setEditData(data);
    setShowToast(true);
  };

  // Fungsi untuk menyembunyikan toast
  const hideToast = () => {
    setShowToast(false);
  };

  // Fungsi untuk menangani perubahan pada formulir edit
  const handleEditChange = (event) => {
    setEditData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  // Fungsi untuk mengirimkan perubahan ke server saat tombol "Submit" ditekan
  const submitEdit = async () => {
    await editKaryawan(editData.id, {
      nama: editData.nama,
      usia: editData.usia,
    });
    hideToast(); // Sembunyikan toast setelah data diedit
  };
  return (
    <div className="flex flex-col bg-teal-500">
      {/* Input form for adding new employee */}
      <div className="container mx-auto mt-8">
        <form
          className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={createKaryawan}
        >
          {/* Input fields for employee name and age */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="nama"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="nama"
              id="nama"
              placeholder="Name"
              value={newKaryawan.nama}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="age"
            >
              Age
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              name="age"
              id="age"
              placeholder="Age"
              value={newKaryawan.age}
              onChange={handleChange}
            />
          </div>
          {/* Button to add a new employee */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Karyawan
          </button>
        </form>
      </div>

      {/* Table to display employee data */}
      <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-white border-b">
                <tr>
                  <th className="px-4 py-2 text-white">id</th>
                  <th className="px-4 py-2 text-white">nama</th>
                  <th className="px-4 py-2 text-white">usia</th>
                  <th className="px-4 py-2 text-white">created_at</th>
                  <th className="px-4 py-2 text-white">aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.id}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {item.nama}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {item.usia}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {item.created_at}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() =>
                          showEditToast({
                            id: item.id,
                            nama: item.nama,
                            usia: item.usia,
                          })
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                        onClick={() => deleteKaryawan(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Toast untuk edit data */}
      {showToast && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            ></span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Edit Karyawan
                    </h3>
                    <div className="mt-2">
                      <form>
                        <div className="mb-4">
                          <label
                            htmlFor="nama"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            name="nama"
                            id="nama"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={editData.nama}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div className="mb-6">
                          <label
                            htmlFor="age"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Age
                          </label>
                          <input
                            type="number"
                            name="age"
                            id="age"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={editData.usia}
                            onChange={handleEditChange}
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={submitEdit}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Submit
                </button>
                <button
                  onClick={hideToast}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Pagination */}
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className="bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
