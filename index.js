const readCsv = require('./read-csv');
const map = require('./concept-sources');
const pathToIncomingDataDictionary = 'KenyaEMR-concepts-used.csv';
const pathToExistingDataDictionary = 'amrs.csv';

const findMissingConcepts = (source, destination) => {
    var r = {
        missing: [],
        datatypeMismatch: [],
        found: []
    };
    for(var o in source.grouped){
        var found = false;
        for(var x in source.grouped[o]) {
            var cur = source.grouped[o][x];
            // console.log('x', x, cur);
            var equivalentSource = map[cur.source];
            var exists = destination.dictionary[equivalentSource + cur.code];
            if(exists) {
                found = true;
                r.found.push({
                    destination: exists,
                    source: cur
                });
                if(cur.datatype !== exists.datatype) {
                    r.datatypeMismatch.push({
                        destination: exists,
                        source: cur
                    });
                }
                break;
            }
        }
        if(!found) {
            r.missing.push(source.grouped[o][0]);
        }
    }
    return r;
};

const start = async ()=> {
    var kenyaEMR = await readCsv(pathToIncomingDataDictionary);
    var amrs = await readCsv(pathToExistingDataDictionary);
    console.log('amrs concepts: ', amrs.groupedCount);
    console.log('kenyaemr concepts: ', kenyaEMR.groupedCount);
    var processed = findMissingConcepts(kenyaEMR, amrs);
    console.log('processed: ', processed);
    console.log('missing: ', processed.missing.length);
    console.log('found: ', processed.found.length);
    console.log('datatypeMismatch: ', processed.datatypeMismatch.length);
    // console.log('found: ', processed.datatypeMismatch);
};

start();