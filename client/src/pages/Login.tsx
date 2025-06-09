import useWindowSize from "../hooks/useWindowSize";

const Login = () => {
  const { widthStr, heightStr } = useWindowSize();
  return (
    <div
      className="w-full flex flex-col sm:justify-center items-center p-6 sm:pb-96 bg-gray-100 dark:bg-slate-900 dark:text-slate-100 text-slate-800"
      style={{ width: widthStr, height: heightStr }}
    >
      <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-md border border-slate-500 shadow-sm dark:border-0 dark:shadow-xl p-6">
        <div className="flex flex-col space-y-4">
          <div className="w-full text-center flex flex-col justify-center items-center">
            <h1>Logo</h1>
            <h1 className="font-medium text-2xl">Sign In</h1>
            <p className="font-medium">to continue to Docs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
