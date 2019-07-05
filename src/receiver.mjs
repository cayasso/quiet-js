
import AudioBackend from './backend/index.mjs'
import receiveProcessor from './processors/receive.mjs'

const getGumConstraints = () => {
    if (navigator.webkitGetUserMedia !== undefined) {
        return {
            audio: {
                optional: [
                  {googAutoGainControl: false},
                  {googAutoGainControl2: false},
                  {echoCancellation: false},
                  {googEchoCancellation: false},
                  {googEchoCancellation2: false},
                  {googDAEchoCancellation: false},
                  {googNoiseSuppression: false},
                  {googNoiseSuppression2: false},
                  {googHighpassFilter: false},
                  {googTypingNoiseDetection: false},
                  {googAudioMirroring: false}
                ]
            }
        };
    }
    if (navigator.mozGetUserMedia !== undefined) {
        return {
            audio: {
                echoCancellation: false,
                mozAutoGainControl: false,
                mozNoiseSuppression: false
            }
        };

    }
    return {
        audio: {
            echoCancellation: false
        }
    };
};

const getUserAudio = async ( deviceId = null ) =>
    navigator.mediaDevices.getUserMedia( {
        audio: {
            deviceId,
            ... getGumConstraints().audio
        }
    } )

export class Receiver {
    constructor( profileKey ) {
        console.log( 'receiver initialized with profile', profileKey )
        this.audioNode = null
        this.backend = new AudioBackend( profileKey )
    }

    async start( deviceId ) {
        this.audioNode = await this.backend.createAudioNode( receiveProcessor )
        return this.resume( deviceId )
    }

    async enumerateInputs() {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(d => d.kind === 'audioinput');
    }

    on( event, fn ) {
        return this.backend.on( event, fn )
    }

    off( event, fn ) {
        return this.backend.off( event, fn )
    }

    pause( ) {
        this.audioNode.disconnect( )
        this.audioStream.getAudioTracks( )
            .forEach( track => track.stop( ) )
    }

    async resume( deviceId ) {
        const context = this.backend.getContext( )

        this.audioStream = await getUserAudio( deviceId )
        this.audioInput = context.createMediaStreamSource( this.audioStream )
        this.audioInput
            .connect( this.audioNode )
            .connect( context.destination )

        context.resume( )
    }

    stop( ) {
        this.pause( )
        this.backend.destroyAudioNode( this.audioNode )
        this.audioNode = this.audioStream = this.audioInput = null
    }
}

export default Receiver