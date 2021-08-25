import "./Loader.css";

const Loader = ({ classNameLoader, classNameLoaderLocation }) => {
  return (
    <div
      className={`container-loader-${classNameLoader}-${classNameLoaderLocation}`}
    >
      <div className="loader">
        <div className={`back-loader-${classNameLoader}`}>
          <div className={`loader-content-${classNameLoader}`}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
