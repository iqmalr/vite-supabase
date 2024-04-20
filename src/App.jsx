import React, { useEffect, useState } from "react";
import { supabase } from "./createClient";
import "./index.css"; // atau path yang sesuai ke file CSS Anda

const App = () => {
  const [listKaryawan, setListKaryawan] = useState([]);
  const [newKaryawan, setNewKaryawan] = useState({
    nama: "",
    age: "",
  });
  // pagination start
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listKaryawan.slice(indexOfFirstItem, indexOfLastItem);
  // pagination end

  useEffect(() => {
    fetchKaryawan();
  }, []);

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
  async function createKaryawan(event) {
    event.preventDefault(); // Menghentikan perilaku default dari form
    await supabase
      .from("karyawan")
      .insert([{ nama: newKaryawan.nama, usia: newKaryawan.age }]); // Menyimpan data karyawan baru ke database
    setNewKaryawan({
      // Mengosongkan state newKaryawan setelah berhasil menyimpan data
      nama: "",
      age: "",
    });
    fetchKaryawan(); // Memuat ulang daftar karyawan setelah menambahkan karyawan baru
  }
  function handleChange(event) {
    setNewKaryawan((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(listKaryawan.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col bg-teal-500">
      {/* <InputForm /> */}
      <div className="container mx-auto mt-8">
        <form
          className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={createKaryawan}
        >
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
          <button type="submit">Add Karyawan</button>
        </form>
      </div>
      {/*  */}
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
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Edit
                      </button>
                      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2">
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
