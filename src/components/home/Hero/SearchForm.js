// import React, { useState } from "react";
// import { Search, Calendar, Users } from "lucide-react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "./datepicker-tailwind.css";
// const SearchForm = () => {
//   const [formData, setFormData] = useState({
//     destination: "",
//     checkIn: null,
//     checkOut: null,
//     guests: "1",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Search submitted:", formData);
//   };

//   return (
//     <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 lg:p-8">
//       <form
//         onSubmit={handleSubmit}
//         className="space-y-4 lg:space-y-0 lg:space-x-4 lg:flex lg:items-end"
//       >
//         {/* Destination */}
//         <div className="flex-1">
//           <div className="relative">
//             <Search
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//               size={20}
//             />
//             <input
//               type="text"
//               name="destination"
//               value={formData.destination}
//               onChange={handleChange}
//               placeholder="Where do you want to go?"
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-tropical-500 focus:border-transparent transition-all duration-300"
//               required
//             />
//           </div>
//         </div>

//         {/* Check-in */}
//         <div className="flex-1">
//           <div className="relative">
//             <Calendar
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
//               size={20}
//             />
//             <DatePicker
//               selected={formData.checkIn}
//               onChange={(date) => setFormData({ ...formData, checkIn: date })}
//               placeholderText="Check-in"
//               dateFormat="MMM d, yyyy"
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-tropical-500 focus:border-transparent transition-all duration-300"
//               required
//             />
//           </div>
//         </div>

//         {/* Check-out */}
//         <div className="flex-1">
//           <div className="relative">
//             <Calendar
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
//               size={20}
//             />
//             <DatePicker
//               selected={formData.checkOut}
//               onChange={(date) => setFormData({ ...formData, checkOut: date })}
//               placeholderText="Check-out"
//               dateFormat="MMM d, yyyy"
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-tropical-500 focus:border-transparent transition-all duration-300"
//               required
//               minDate={formData.checkIn}
//             />
//           </div>
//         </div>

//         {/* Guests */}
//         <div className="flex-1">
//           <div className="relative">
//             <Users
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//               size={20}
//             />
//             <select
//               name="guests"
//               value={formData.guests}
//               onChange={handleChange}
//               className="w-full pl-10 pr-2 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white appearance-none focus:ring-2 focus:ring-tropical-500 focus:border-transparent transition-all duration-300"
//             >
//               {[...Array(10)].map((_, i) => (
//                 <option key={i + 1} value={i + 1}>
//                   {i + 1} {i === 0 ? "Guest" : "Guests"}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Submit */}
//         <div className="lg:flex-shrink-0">
//           <button
//             type="submit"
//             className="w-full lg:w-auto px-8 py-3 bg-tropical-600 hover:bg-tropical-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
//           >
//             Search
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SearchForm;
