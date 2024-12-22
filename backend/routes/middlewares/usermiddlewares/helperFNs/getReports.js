const { Report } = require("../../../../db/db")

const getReports = async(userID)=>{
    let Reports = await Report.find({
        userId : userID
    })

    return Reports;
}



module.exports = {
    getReports
}