export function DevResetAuth() {
    const handleReset = () => {
        localStorage.clear();
        sessionStorage.clear();
        alert("Auth reset!");
        window.location.reload();
    };

    return (
        <button
            onClick={handleReset}
    style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}
>
    RESET AUTH
    </button>
);
}
