import '../CSS/Cart.css'
import {Link} from "react-router-dom";
import {HugeiconsIcon} from "@hugeicons/react";
import {Cancel01Icon, CancelCircleIcon} from "@hugeicons/core-free-icons";
import {useCart} from "../../Context/CartContext.jsx";
import axios from "axios";
import {toast} from "react-toastify";

function CartItem({item}) {
    if (!item || !item.book) return null;

    const {cartid, book} = item;
    const {bookid, booktitle, price, coverImage} = book;

    const {fetchCartData} = useCart();

    const handleRemove = async () => {
        try {
            await axios.delete(`http://localhost:8080/user/cart/${cartid}/remove`, {
                withCredentials: true,
            });
            toast.success("Item removed from cart");
            fetchCartData(); // refresh cart
        } catch (err) {
            toast.error("Failed to remove item");
        }
    };

    return (
        <li className="cart-item">
            <div className="cart-item-info">
                <Link to={`/book/${bookid}-${booktitle.replaceAll(" ", "-").toLowerCase()}`}>
                    <img
                        src={`data:image/jpeg;base64,${coverImage}`}
                        alt={booktitle}
                        className="cart-item-img"
                    />
                </Link>
                <div className="cart-item-data">
                    <Link
                        to={`/book/${bookid}-${booktitle.replaceAll(" ", "-").toLowerCase()}`}
                        className="cart-item-title"
                    >
                        <div>{booktitle}</div>
                    </Link>
                    <div className="cart-item-price">
                        ${price}
                    </div>
                </div>

            </div>
            <div className="cart-item-action">
                <button className="cart-item-remove-btn" onClick={handleRemove}>
                    <HugeiconsIcon icon={CancelCircleIcon} size="1.5rem"/>
                </button>

            </div>
        </li>
    );
}

export default CartItem;