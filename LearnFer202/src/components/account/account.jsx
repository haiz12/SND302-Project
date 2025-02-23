import { useEffect, useState } from "react";
import { ListAccountAPI } from "./account.api";
import AccountTable from "./accountTable";
import AccountForm from "./account.form";

const Account = () => {
    const [dataAccounts, setDataAccounts] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        loadAccount();

    }, [current, pageSize]);

    const loadAccount = async () => {
        try {
            // Kiểm tra giá trị của current trước khi gọi API
            if (!current || typeof current !== 'number') {
                console.error("Giá trị của current không hợp lệ:", current);
                return;
            }

            const res = await ListAccountAPI(current, pageSize);
            if (res.data) {
                setDataAccounts(res.data.accounts);
                setCurrent(res.data.currentPage);
                setPageSize(res.data.pageSize);
                setTotal(res.data.total);
            }
        } catch (error) {
            console.error("Error loading products:", error); // In lỗi ra console
        }
    };

    return (
        <>
            <div style={{ padding: "20px" }}>
            <AccountForm loadAccount={loadAccount} />
                <AccountTable
                    dataAccounts={dataAccounts}
                    loadAccount={loadAccount}
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    setCurrent={setCurrent}
                    setPageSize={setPageSize} />
            </div>
        </>
    );
}
export default Account