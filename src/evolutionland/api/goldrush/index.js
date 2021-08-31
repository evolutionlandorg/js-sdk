import Utils from '../../utils/index';

const GoldrushApi = {
        /**
     * This function is used to join Gold Rust event through ETH/ERC20 Tokens
     * @param {*} eventId The event id which to join
     * @param {*} landId The land token id which to join
     * @param {*} amount The ring amount which to submit
     * @param {*} subAddr The dvm address for receiving the new land
     * @param {*} callback
     */
    goldRushRaffleJoin(eventId, landTokenId, amount, subAddr, callback= {}) {
        return this.triggerContract({
            methodName: 'join',
            abiKey: 'goldRushRaffle',
            abiString: this.ABIs['goldRushRaffle'].abi,
            contractParams: [
                eventId, Utils.pad0x(landTokenId), amount, subAddr
            ]
        }, callback);
    },

    /**
     * This function is used to change the ring stake amount
     * @param {*} eventId event id which to join
     * @param {*} landTokenId The land token id which to change
     * @param {*} amount The new submit ring amount
     * @param {*} callback
     */
     goldRushRaffleChangeAmount(eventId, landTokenId, amount, callback= {}) {
        return this.triggerContract({
            methodName: 'changeAmount',
            abiKey: 'goldRushRaffle',
            abiString: this.ABIs['goldRushRaffle'].abi,
            contractParams: [
                eventId, Utils.pad0x(landTokenId), amount,
            ]
        }, callback);
    },

    /**
     * This function is used to change the dvm address
     * @param {*} eventId event id which to join
     * @param {*} landTokenId The land token id which to change
     * @param {*} subAddr The new submit dvm address
     * @param {*} callback
     */
     goldRushRaffleChangeSubAddr(eventId, landTokenId, subAddr, callback= {}) {
        return this.triggerContract({
            methodName: 'changeSubAddr',
            abiKey: 'goldRushRaffle',
            abiString: this.ABIs['goldRushRaffle'].abi,
            contractParams: [
                eventId, Utils.pad0x(landTokenId), subAddr,
            ]
        }, callback);
    },

    /**
     * This function is used to change join info.
     * @param {*} eventId event id which to join
     * @param {*} landTokenId The land token id which to change
     * @param {*} amount The new submit amount
     * @param {*} subAddr The new submit dvm address
     * @param {*} callback
     */
     goldRushRaffleChangeInfo(eventId, landTokenId, amount, subAddr, callback= {}) {
        return this.triggerContract({
            methodName: 'change',
            abiKey: 'goldRushRaffle',
            abiString: this.ABIs['goldRushRaffle'].abi,
            contractParams: [
                eventId, Utils.pad0x(landTokenId), amount, subAddr,
            ]
        }, callback);
    },

    /**
     * This function is used to exit Gold Rush event
     * @param {*} eventId event id which to join
     * @param {*} landTokenId The land token id which to exit
     * @param {*} callback
     */
    goldRushRaffleExit(eventId, landTokenId, callback= {}) {
        return this.triggerContract({
            methodName: 'exit',
            abiKey: 'goldRushRaffle',
            abiString: this.ABIs['goldRushRaffle'].abi,
            contractParams: [
                eventId, Utils.pad0x(landTokenId),
            ]
        }, callback);
    },

    /**
     * This function is used to redeem prize after lottery
     * _hashmessage = hash("${address(this)}${fromChainId}${toChainId}${eventId}${_landId}${_won}")
     * @param {*} eventId event id which to join
     * @param {*} landTokenId The land token id which to draw
     * @param {*} isWon Is winner
     * @param {*} toChainId The chainId for receiving network
     * @param {*} signature _v, _r, _s are from supervisor's signature on _hashmessage while the _hashmessage is signed by supervisor.
     * @param {*} callback
     */
    goldRushRaffleDraw(eventId, landTokenId, isWon, {hashmessage, v, r, s}, callback= {}) {
        return this.triggerContract({
            methodName: 'draw',
            abiKey: 'goldRushRaffle',
            abiString: this.ABIs['goldRushRaffle'].abi,
            contractParams: [
                eventId, Utils.pad0x(landTokenId), isWon, hashmessage, v, r, s
            ]
        }, callback);
    },

    /**
     * check the land is valid
     * @param {*} landTokenId The land token id which to check
     */
    goldRushRaffleLandCheck(landTokenId, callback= {}) {
        return this.callContract({
            methodName: 'check',
            abiKey: 'goldRushRaffle',
            abiString: this.ABIs['goldRushRaffle'].abi,
            contractParams: [
                Utils.pad0x(landTokenId)
            ]
        }, callback);
    },

    /**
     * Get info of Raffle by eventId and landTokenId.
     * @param {*} eventId Gold Rush Event ID
     * @param {*} landTokenId The land token id which to query
     * @param {*} callback
     */
    goldRushRaffleGetHistory(eventId, landTokenId, callback= {}) {
        return this.callContract({
            methodName: 'lands',
            abiKey: 'goldRushRaffle',
            abiString: this.ABIs['goldRushRaffle'].abi,
            contractParams: [
                eventId, landTokenId
            ]
        }, callback);
    },
};

export default GoldrushApi;
