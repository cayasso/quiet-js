
const ab2str = buffer => {
    const utf16Codes = new Uint16Array( buffer )
    const totalSize = utf16Codes.length
    const chunkSize = 1e4 // 10000 items at a time

    let str = ''
    for( let i = 0; i < totalSize; i += chunkSize ) {
        const slice = utf16Codes.subarray( i, i + chunkSize )
        const utf16 = String.fromCharCode.apply( null, slice )
        str += utf16
    }

    return str
}

const ab2str_legacy = ab => decodeURIComponent(escape(String.fromCharCode.apply(null, new Uint8Array(ab))));

const str2ab = str => {
    const buf = new ArrayBuffer( str.length * 2 )
    const view = new Uint16Array( buf )
    for( let i = 0; i < view.length; i ++ ) {
        view[ i ] = str.charCodeAt( i )
    }

    return buf
}

const str2ab_legacy = s => {
    var s_utf8 = unescape(encodeURIComponent(s));
    var buf = new ArrayBuffer(s_utf8.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0; i < s_utf8.length; i++) {
        bufView[i] = s_utf8.charCodeAt(i);
    }
    return buf;
}

export default {
    ab2str,
    ab2str_legacy,
    str2ab,
    str2ab_legacy
}