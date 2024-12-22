import React from 'react';
import Button from './Button';

/**
 * ButtonList renders a button with either a border or a solid background. 
 * It accepts a function to call when the button is clicked and displays 
 * the provided children as the button text.
 *
 * @param {{border: boolean, onClick: Function, children: React.ReactNode}} props
 * @returns {JSX.Element}
 */
function ButtonList({ border, onClick, children }) {
  const buttonClass = border 
    ? "button_border rounded-full px-6 sm:px-8 " 
    : "button_bg rounded-full px-6 sm:px-8 ";

  return (
    <Button onClick={onClick} variant="default" className={buttonClass}>
      {children}
    </Button>
  );
}

export default ButtonList;
