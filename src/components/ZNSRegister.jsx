// import React, { useState } from 'react';
// import { useZNS } from '../context/znsContext';
// import { useAppKitAccount } from '@reown/appkit/react';

//  const ZNSRegister = () =>  {

//   const { address, isConnected } = useAppKitAccount();
//   const { registerDomain } = useZNS();
//   // const { registerDomain, isLoading, error, domain } = useZNS();
//   const [domainName, setDomainName] = useState('');

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   if (!isConnected || !window.ethereum) return;
//   //   await registerDomain(window.ethereum, domainName);
//   // };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await registerDomain(domainName); // No need to pass walletClient
//   };

//   return (
//     <div className="p-4 border rounded-lg">
//       <h3 className="text-lg font-bold mb-2">Register ZNS Domain</h3>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={domainName}
//           onChange={(e) => setDomainName(e.targetValue)}
//           placeholder="yourname"
//           className="border p-2 rounded mr-2"
//           // disabled={isLoading}
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 text-white p-2 rounded"
//           disabled={!isConnected}
//         >
//           {/* {isLoading ? 'Registering...' : 'Register'} */}
//         </button>
//       </form>
//       {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
//       {domainName && (
//         <p className="text-green-500 mt-2">
//           Success! Registered: <strong>{domainName}</strong>
//         </p>
//       )}
//     </div>
//   );
// }

// export default ZNSRegister;