import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useContextState } from "../context";
import { useForm, SubmitHandler } from "react-hook-form";
import { auth } from "../firebase";

type FormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { authenticated } = useContextState();

  const { handleSubmit, register, errors } = useForm();

  useEffect(() => {
    if (authenticated) history.push("/");
  }, [authenticated, history]);

  const submitForm: SubmitHandler<FormValues> = ({ email, password }) => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((signedInUser) => {
        dispatch("LOGIN", signedInUser);
        history.goBack();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex bg-white">
      <div className="h-screen bg-center bg-cover w-36" style={{ backgroundImage: "url('/texture.jpg')" }} />
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Login</h1>
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="mb-2">
              <input
                type="email"
                className={`${errors.email && "border-red-500"}
           w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white`}
                placeholder="EMAIL"
                name="email"
                ref={register({ required: true })}
              />
              {errors.email && <small className="font-medium text-red-600">This field is required</small>}
            </div>
            <div className="mb-4">
              <input
                className={`${errors.password && "border-red-500"}
           w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white`}
                type="password"
                name="password"
                ref={register({ required: true })}
                placeholder="PASSWORD"
              />
              {errors.password && <small className="font-medium text-red-600">This field is required</small>}
            </div>
            <button
              type="submit"
              className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded focus:outline-none"
            >
              Login
            </button>
          </form>
          <small>
            New to Reddit?
            <Link to="/register" className="ml-1 text-blue-500 uppercase">
              Sign Up
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
