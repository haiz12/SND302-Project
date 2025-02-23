import { useContext } from "react";
import { AuthContext } from "../components/context/auth.context";
import { Link } from "react-router-dom";
import { Button, Result } from "antd";

const PrivateRoute = (props) => {
    const { user } = useContext(AuthContext);

    if (user && user._id) {
        return (
            <>
                {props.children}
            </>)
    }

    return (
        <Result
            status="403"
            title="Unauthorize!"
            subTitle={"Bạn cần đăng nhập để truy cập nguồn tài nguyên này."}
            extra={<Button type="primary">
                <Link to="/login">
                    <span>Back to login</span>
                </Link>
            </Button>}
        />
    )


  
}

export default PrivateRoute;