import { useEffect, useState } from "react";
import OutOrderTable from "./out-order.table";
import { OutOrderAPI } from "./out-order.api";

const OutOrder = () => {
    const [dataOutOrder, setDataOutOrder] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        loadOutOrder();

    }, [current, pageSize]);

    const loadOutOrder = async () => {
        try {
            // Kiểm tra giá trị của current trước khi gọi API
            if (!current || typeof current !== 'number') {
                console.error("Giá trị của current không hợp lệ:", current);
                return;
            }

            const res = await OutOrderAPI(current, pageSize);
            if (res.data) {
                setDataOutOrder(res.data.out_orders);
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
                <OutOrderTable
                    dataOutOrder={dataOutOrder}
                    loadOutOrder={loadOutOrder}
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    setCurrent={setCurrent}
                    setPageSize={setPageSize} />
            </div>
        </>
    );
};
export default OutOrder