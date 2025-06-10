import { memo } from 'react';

import resets from '../_resets.module.css';
import classes from './EventButton.module.css';

const EventButtons = memo(function EventButtons(props = {}) {
  return (
    <button
      className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}
    >
      {props.text?.button != null ? (
        props.text?.button
      ) : (
        <div className={classes.button}>Button</div>
      )}
    </button>
  );
});

export default EventButtons;
