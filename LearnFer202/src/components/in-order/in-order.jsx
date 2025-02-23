import { useEffect, useState } from "react";
import InOrderTable from "./in-order.table";
import { InOrderAPI } from "./in-order.api";

const InOrder = () => {
    const [dataInOrder, setDataInOrder] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        loadInOrder();

    }, [current, pageSize]);

    const loadInOrder = async () => {
        try {
            // Kiểm tra giá trị của current trước khi gọi API
            if (!current || typeof current !== 'number') {
                console.error("Giá trị của current không hợp lệ:", current);
                return;
            }

            const res = await InOrderAPI(current, pageSize);
            if (res.data) {
                setDataInOrder(res.data.in_orders);
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
            <div style={{ padding: "20px", height: "100vh" }}>
                <InOrderTable
                    dataInOrder={dataInOrder}
                    loadInOrder={loadInOrder}
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    setCurrent={setCurrent}
                    setPageSize={setPageSize} />
            </div>
        </>
    );
};
export default InOrder