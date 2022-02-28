const { io } = require('../index');
const Bands = require('../models/bands')
const Band = require('../models/band');

const bands = new Bands();

bands.addBand( new Band('Chonz'));
bands.addBand( new Band('Chinz'));
bands.addBand( new Band('Queen'));
bands.addBand( new Band('HardBass'));


// Mensaje de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { console.log("Cliente desconectado")});

    client.on('mensaje', (payload) => {
        console.log('Mensaje', payload);

        io.emit('mensaje', { admin: 'Nuevo mensaje desde Backend' });

    });

    client.on('emitir-mensaje', ( payload ) => {
        //io.emit( 'nuevo-mensaje', payload ); //emite a todos
        client.broadcast.emit('nuevo-mensaje', payload); //Emite a todos menos al emisor
    });

    client.on('vote-band', ( payload ) => {
        
        bands.voteBand( payload.id );
        io.emit('active-bands', bands.getBands());


    });

    client.on('add-band', ( payload ) => {
        
        bands.addBand( new Band(payload.name) );
        io.emit('active-bands', bands.getBands());


    });

    client.on('delete-band', ( payload ) => {
        
        bands.deleteBand( payload.id );
        io.emit('active-bands', bands.getBands());


    });

    


    


});