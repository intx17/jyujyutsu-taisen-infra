export const callbackMock = (err: Error | null, obj: object | undefined): void => {
    if (err) {
        console.log('error occured.');
        console.log(err);
        process.exit(1);
    }
    console.log(obj);
    console.log('succeeded.')
    process.exit(0);
}