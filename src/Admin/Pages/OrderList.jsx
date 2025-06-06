import OrderTable from "../Components/JSX/OrderTable.jsx";
import {useTheme} from "../../Shared/Context/ThemeContext.jsx";

function OrderList() {

    const { theme } = useTheme();

    return (
        <>
            <OrderTable title={"Order List"} theme={theme}/>
        </>
    )
}

export default OrderList