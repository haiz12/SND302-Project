import { useEffect, useState } from "react";
import SupplierTable from "./supllier.Table";
import { SupllierAPI } from "./supllier.api";
import SupplierForm from "./suppler.form";

const Supplier = () => {
    const [dataSuppllier, setDataSuppllier] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        loadSupplier();

    }, [current, pageSize]);

    const loadSupplier = async () => {
        try {
            // Kiểm tra giá trị của current trước khi gọi API
            if (!current || typeof current !== 'number') {
                console.error("Giá trị của current không hợp lệ:", current);
                return;
            }

            const res = await SupllierAPI(current, pageSize);
            if (res.data) {
                setDataSuppllier(res.data.suppliers);
                setCurrent(res.data.currentPage);
                setPageSize(res.data.pageSize);
                setTotal(res.data.total);
            }
        } catch (error) {
            console.error("Error loading Suppllier:", error); // In lỗi ra console
        }
    };

    return (
        <>
            <div style={{ padding: "20px" ,  height: "100vh"}}>
            <SupplierForm loadSupplier={loadSupplier} />
                <SupplierTable
                    dataSuppllier={dataSuppllier}
                    loadSupplier={loadSupplier}
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    setCurrent={setCurrent}
                    setPageSize={setPageSize} />
            </div>
        </>
    );
};
export default Supplier