import { useEffect, useState } from "react";
import ProductTable from "./product.table";
import { ListProductAPI } from "./product.api";
import ProductForm from "./product.form";

const Product = () => {
    const [dataProducts, setDataProducts] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        loadProduct();

    }, [current, pageSize]);

    const loadProduct = async () => {
        try {
            // Kiểm tra giá trị của current trước khi gọi API
            if (!current || typeof current !== 'number') {
                console.error("Giá trị của current không hợp lệ:", current);
                return;
            }

            const res = await ListProductAPI(current, pageSize);
            if (res.data) {
                setDataProducts(res.data.products);
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
            <div style={{ padding: "20px" ,  height: "100vh",}}>
            <ProductForm loadProduct={loadProduct} />
                <ProductTable
                    dataProducts={dataProducts}
                    loadProduct={loadProduct}
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    setCurrent={setCurrent}
                    setPageSize={setPageSize} />
            </div>
        </>
    );
};
export default Product