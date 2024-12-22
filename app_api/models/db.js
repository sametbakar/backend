var mongoose=require('mongoose');
var dbURI="mongodb+srv://sametders32:3VSuBvOCSLX9rPnI@clustermekanbul.69pzl.mongodb.net/mekanbul?retryWrites=true&w=majority&appName=ClusterMekanbul";
//var dbURI="mongodb://localhost/mekanbul"
mongoose.connect(dbURI);
mongoose.connection.on("connected",function(){
    console.log(dbURI+" adresindeki veritabanına bağlandı.")
});
mongoose.connection.on("disconnected",function(){
    console.log(dbURI+" adresindeki veritabanının bağlantısı koptu!")
});
//uygulama kapandığında veritabanını kapat
process.on("SIGINT",function(){
    mongoose.connection.close();
    console.log("Bağlantı kesildi!");
    process.exit(0);
});

require('./venue')