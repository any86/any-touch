interface Session {
    input: any;
    computed: any;
    eventBus: any;
}

let session: Session = {
    input: {
        isStart: false,
        isMove: false,
        isEnd: true,
    },
    computed: {},
    eventBus: {},
};

export default session;