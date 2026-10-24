function errorHandler(req,res,err,next){
    res.status(500).json({
        message:"Internal server error"
    })
    
    next()
}

module.exports= errorHandler