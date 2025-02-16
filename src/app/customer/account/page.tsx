import React from 'react'

const Account: React.FC = () => {

  return (
    <section className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto space-y-4">
		<h1 className="w-full">Manage Account</h1>
        <div className="grid grid-cols-3 rounded-lg border shadow">
          <div className="col-span-1 p-4 border-r">
              <button>
					Profile
			  </button>
          </div>
          <div className="col-span-2 p-4 space-y-4">
				<input type="text" placeholder="Name" className="input-skin" />
				<input type="text" placeholder="Username" className="input-skin" />
				<input type="text" placeholder="Email" className="input-skin" />
          </div>
        </div>
    </section>
  )
}

export default Account