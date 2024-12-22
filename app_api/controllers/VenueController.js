var mongoose=require("mongoose");
var Venue=mongoose.model("venue");

const createResponse=function(res,status,content){
    res.status(status).json(content);
}

const listVenues=function(req,res){
    createResponse(res,200,{"status":"success"});
}

const addVenue=async function(req,res){
    try {
        await Venue.create({
            ...req.body,
            coordinates:[req.body.lat,req.body.long],
            hours:[
                {
                    days:req.body.days1,
                    open:req.body.open1,
                    close:req.body.close1,
                    isClosed:req.body.isClosed1
                },
                {
                    days:req.body.days2,
                    open:req.body.open2,
                    close:req.body.close2,
                    isClosed:req.body.isClosed2

                }
            ]
        }).then(function(venue){
            createResponse(res,201,venue);
        });
    } catch (error) {
        createResponse(res,400,error);
    }
}

const getVenue=async function(req,res){
    try {
        await Venue.findById(req.params.venueid)
        .exec()
        .then(function(venue){
            createResponse(res,200,venue);
        });
    } catch (error) {
        createResponse(res,404,{status:"Böyle bir mekan yok"});
    }
}

const updateVenue = async function(req, res) {
    try {
        // Mekanı bul ve güncelle
        const venue = await Venue.findById(req.params.venueid).exec();

        if (!venue) {
            return createResponse(res, 404, { status: "Böyle bir mekan yok" });
        }

        // Mekanın özelliklerini güncelle
        if (req.body.name) venue.name = req.body.name;
        if (req.body.lat && req.body.long) venue.coordinates = [req.body.lat, req.body.long];
        if (req.body.days1 || req.body.days2) {
            if (req.body.days1) {
                venue.hours[0].days = req.body.days1;
                venue.hours[0].open = req.body.open1;
                venue.hours[0].close = req.body.close1;
                venue.hours[0].isClosed = req.body.isClosed1;
            }
            if (req.body.days2) {
                venue.hours[1].days = req.body.days2;
                venue.hours[1].open = req.body.open2;
                venue.hours[1].close = req.body.close2;
                venue.hours[1].isClosed = req.body.isClosed2;
            }
        }

        // Diğer alanları da güncelle
        if (req.body.description) venue.description = req.body.description;
        if (req.body.address) venue.address = req.body.address;
        if (req.body.phone) venue.phone = req.body.phone;

        // Güncellenen veriyi kaydet
        await venue.save();
        createResponse(res, 200, { status: "Mekan başarıyla güncellendi", venue: venue });
    } catch (error) {
        createResponse(res, 400, { status: "Güncellenirken bir hata oluştu", error: error });
    }
}

const deleteVenue= async function(req,res){
    try {
        await Venue.findByIdAndDelete(req.params.venueid).then(function (venue){
            createResponse(res,200,{status:venue.name+" isimli mekan Silindi"});
        });
    } catch (error) {
        createResponse(res, 404,{status:"Böyle bir mekan yok!"});
    }
}


module.exports={
    listVenues,
    getVenue,
    addVenue,
    updateVenue,
    deleteVenue
}