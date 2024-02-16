// Fungsi helper untuk menghasilkan tanggal dalam format 'YYYY-MM-DD'
function generateDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

//Export fungsi helper agar bisa digunakan di file lain

module.exports = {
    generateDate
}