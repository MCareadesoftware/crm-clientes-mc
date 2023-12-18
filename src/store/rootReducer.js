import layout from "./layout";
import userReducer from "./userSlice";

const rootReducer = {
  layout,
  user: userReducer,
};
export default rootReducer;
