"use client"

   export default function Dashboard() {
       const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

       return (
           <div style={{ textAlign: 'center', marginTop: '50px' }}>
               <h1>Dashboard</h1>
               {token ? (
                   <div>
                       <p>You are logged in!</p>
                       <p>JWT Token: {token}</p>
                       <button
                           onClick={() => {
                               localStorage.removeItem('token');
                               window.location.href = '/';
                           }}
                           style={{
                               padding: '10px 20px',
                               fontSize: '16px',
                               backgroundColor: '#ff4444',
                               color: 'white',
                               border: 'none',
                               borderRadius: '5px',
                               cursor: 'pointer',
                           }}
                       >
                           Logout
                       </button>
                   </div>
               ) : (
                   <p>Please login first.</p>
               )}
           </div>
       );
   }