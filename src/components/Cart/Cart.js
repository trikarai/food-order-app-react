import { Fragment, useContext, useState } from "react";
import CartContext from "../../store/cart-context";
import Modal from "../UI/Modal";
import classes from "./Cart.module.css";
import CartItem from "./CartItem";

import CheckOut from "./CheckOut";

const Cart = (props) => {
  const [isCheckOut, setisCheckOut] = useState(false);
  const [isSubmiting, setisSubmiting] = useState(false);
  const [didSubmit, setdidSubmit] = useState(false);

  const cartCtx = useContext(CartContext);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;

  const hasItem = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };
  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const orderHandler = () => {
    setisCheckOut(true);
  };

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["btn--alt"]} onClick={props.onHideCart}>
        Close
      </button>
      {hasItem && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const submitOrderHandler = async (userData) => {
    setisSubmiting(true);
    await fetch(
      "https://react-http-dbe23-default-rtdb.asia-southeast1.firebasedatabase.app/order.json",
      {
        method: "POST",
        body: JSON.stringify({
          user: userData,
          orderedItem: cartCtx.items,
        }),
      }
    );
    setisSubmiting(false);
    setdidSubmit(true);
    cartCtx.clearCart();
  };

  const cartItems = (
    <ul className={classes["cart-item"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const cartModalContent = (
    <Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total</span> <span>{totalAmount}</span>
      </div>
      {isCheckOut && (
        <CheckOut onConfirm={submitOrderHandler} onCancel={props.onHideCart} />
      )}
      {!isCheckOut && modalActions}{" "}
    </Fragment>
  );

  const isSubmitingModalContent = <p>sending order data...</p>;

  const didSubmitModalContent = (
    <Fragment>
      <p>meals ordered</p>
      <button className={classes.button} onClick={props.onHideCart}>
        Close
      </button>
    </Fragment>
  );

  return (
    <Modal onHideCart={props.onHideCart}>
      {!isSubmiting && !didSubmit && cartModalContent}
      {isSubmiting && isSubmitingModalContent}
      {!isSubmiting && didSubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;
