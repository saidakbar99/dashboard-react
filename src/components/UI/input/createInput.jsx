import React from 'react'
import styles from './createInput.module.css'

function CreateInput(props) {
    return (
        <input type="text" className={styles.createInput} {...props} />
    );
}

export default CreateInput;