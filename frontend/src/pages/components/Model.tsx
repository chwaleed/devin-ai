function Model({ children, close, onClick }: props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select User</h2>
          <button onClick={close} className="p-2">
            <i className="ri-close-fill"></i>
          </button>
        </header>
        {children}
        <button
          onClick={onClick}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Add Collaborators
        </button>
      </div>
    </div>
  );
}

type props = {
  children: React.ReactNode;
  close: () => void;
  onClick: (event: React.MouseEvent) => void;
};
export default Model;
