import React from 'react'

const Page: React.FC = () => {
  return (
    <section className="flex items-center justify-center bg-primary">
        <div className="border shadow-xl flex flex-col items-center justify-center p-4 space-y-4">
            <input type="text" id="adminUsername" placeholder="Username" />
            <input type="password" id="adminPassword" placeholder="Password" />
            <button>
                Login
            </button>
        </div>
    </section>
  )
}

export default Page