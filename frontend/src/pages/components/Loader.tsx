function Loader({ size = "text-[5rem]" }) {
  return (
    <div className="inline-flex items-center justify-center overflow-hidden ">
      <i className={`ri-loader-fill animate-spin ${size}`}></i>
    </div>
  );
}

export default Loader;
