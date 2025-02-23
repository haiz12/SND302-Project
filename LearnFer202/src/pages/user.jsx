import UserForm from "../components/user/user.form";
import UserTable from "../components/user/user.table";
import { fetchAllUserAPI } from "../services/api.service";
import { useEffect, useState } from "react";

const UserPage = () => {
  const [dataUsers, setDataUsers] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  //empty array => run once
  useEffect(() => {
    loadUser();
  }, [current, pageSize]);
  const loadUser = async () => {
    try {
      // Kiểm tra giá trị của current trước khi gọi API
      if (!current || typeof current !== 'number') {
        console.error("Giá trị của current không hợp lệ:", current);
        return;
      }

      const res = await fetchAllUserAPI(current, pageSize);
      if (res.data) {
        setDataUsers(res.data.customers);
        setCurrent(res.data.currentPage);
        setPageSize(res.data.pageSize);
        setTotal(res.data.total);
      }
    } catch (error) {
      console.error("Error loading Suppllier:", error); // In lỗi ra console
    }
  };

  // lift-up state
  return (
    <div style={{ padding: "20px" ,   height: "100vh"}}>
      <UserForm loadUser={loadUser} />
      <UserTable
        dataUsers={dataUsers}
        loadUser={loadUser}
        current={current}
        pageSize={pageSize}
        total={total}
        setCurrent={setCurrent}
        setPageSize={setPageSize}
      />
    </div>
  );
};

export default UserPage;
