import React from 'react'
import styles from './MyInput.module.css'

function MyInput(props) {
    return (
        <div className={styles.searchPositionContainer}>
            <i id='search-icon-position' className="bi bi-search"></i>
            <input type="text" className={styles.MyInput} {...props} />
        </div>
    );
}

export default MyInput;