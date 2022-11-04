import { useEffect, useRef } from 'react';

export function ClickDetector(props) {
  const ref = useRef(null);
  const { onClickOutside } = props;

  useEffect(() => {
    console.log('in click detector');
    console.log(ref.current);
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [ onClickOutside ]);

  if(!props.show)
    return null;

  return (
    <div ref={ref} className='info-box'>
        {props.message}
    </div> );
}

export default ClickDetector;