  <div className={styles.cardWrapperContainer}>
    <div className={styles.cardWrapper}>
      {loading ? (
        <div className={styles.spinnerWrapper}>
          <div className={styles.spinner}></div>
        </div>
      ) : plants.length === 0 ? (
        <div>No plants assigned.</div>
      ) : (
        plants.map((plant) => (
          // ... existing code ...
        ))
      )}
    </div>
  </div> 