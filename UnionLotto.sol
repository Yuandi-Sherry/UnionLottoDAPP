pragma solidity ^0.5.1;
contract UnionLotto {
    string public id; 
    string public date;
    uint public firstPrize;
    uint public secondPrize;
    uint[7] public winnerNumbers;
    // should be private66
    uint private prizePond;
    address private authority;
    mapping(address=>Bet[]) private bets;
    address payable [] private users;
    uint private totalPrice;
    
    bool private lottoOn; // 仍然可以投注 
    
    // private:
    address payable [] firstPrizeWinners;
    address payable [] secondPrizeWinners;
    // public: the number of winners of every level prize and bonus for each level prize
    uint [6] public countResults = [uint256(0),0,0,0,0,0];
    //uint [6] public prizeForEachLevel = [uint256(0), 0, 300 ether, 200 ether, 10 ether, 5 ether];
    uint [6] public prizeForEachLevel = [uint256(0), 0, 4 ether, 3 ether, 2 ether, 1 ether];

    // 一注彩票 
    struct Bet  {
        uint[7] numbers; // 选取的号码: 0->red, 1~6->blue
        uint count; // buy count bets this time. 买了count注
    }
    
    constructor(string memory _id , string memory _date) public payable{
        authority = 0x4C02D8D6CF951E636642a21F43BBB46C7fBF9342;
        require(msg.sender == authority, "You don't have the right to post a lottery"); // success
        id = _id;
        prizePond = msg.value;
        date = _date;
        // todo using event
        lottoOn = true;
    }
    
    function bet(uint[7] memory numbers) public payable  {// debugging done
        require(lottoOn == true, "The Lottery has been closed"); // ok
        require(msg.value >= 2 ether, "No enough money");
        require(msg.value % 2 == 0 ether, "Please pay for a complete Lottery(2 ether/note)");
        
        if(bets[msg.sender].length == 0) { // haven't Bet
            users.push(msg.sender);
        }
        bets[msg.sender].push(Bet(numbers, msg.value/2 ether));
        totalPrice += msg.value; 
    }
    
    /**
     * randomly generate winnerNumbers
     */
    function draw() public {
        //todo change to emit a event
        lottoOn = false;
        uint range = 32*15*15*15*15*15*15;
        uint random = rand(range);
        // red ball
        uint redBall = random%33+1;
        random = random/32;
        winnerNumbers[0] = redBall;
        for(uint j = 1; j < 7; j++) {
            uint blue = random%16 + 1; // generate first blue ball
            bool flag = true;
            
            while(true) {
                flag = true;
                for(uint k = 1; k < j; k++) {
                    if(winnerNumbers[k] == blue) {
                        flag = false;
                        blue = (blue+1)%16;
                        if(blue == 0)
                            blue += 1;
                    }
                }
                if(flag)
                    break;
            }
            winnerNumbers[j] = blue;
            random = random/15;
        }
    }
    /**
     * get winnerNumber from outsider
     */
    function draw(uint[7] memory results) public {
        //todo change to emit a event
        lottoOn = false;
        winnerNumbers = results;
    }
    
    /**
     * compute the prize for each level prize
     */
    function computeResults() public payable{
        uint highLevelBonus = totalPrice;
        
        for(uint i = 0; i < users.length; i++) {
            for(uint j = 0; j < bets[users[i]].length; j++) {
                uint result = checkPriceLevel(bets[users[i]][j].numbers);
                if(result >= 3) {
                    // send bonus
                    if(result != 7) {
                        uint temp = prizeForEachLevel[result - 1];
                        users[i].transfer( temp * bets[users[i]][j].count );
                    }
                } else {
                    // record
                    if(result == 1) {
                        for(uint k_first = 1; k_first <= bets[users[i]][j].count; k_first++) {
                            firstPrizeWinners.push(users[i]);
                        }
                    }
                    else {
                        for(uint k_second = 1; k_second <= bets[users[i]][j].count; k_second++) {
                            secondPrizeWinners.push(users[i]);
                        }
                    }
                }
                if(result != 7)
                    countResults[result - 1]+= bets[users[i]][j].count;
            }
        }
        for(uint k = 2; k < 6; k++) {
            highLevelBonus -= prizeForEachLevel[k]*countResults[k];
        }
        
        // count first prize bonus
        if(countResults[0] != 0) {
            if(totalPrice < 100000000 ether) {
                prizeForEachLevel[0] = uint(highLevelBonus * 3/4) + prizePond;
            } else {
                prizeForEachLevel[0] = uint(highLevelBonus * 11 / 20) + prizePond;
            }
            prizeForEachLevel[0] /= countResults[0];
            if(prizeForEachLevel[0] > 5000000 ether) {
                prizeForEachLevel[0] = 5000000 ether;
            }
            for(uint i_firstWinner = 0; i_firstWinner < firstPrizeWinners.length; i_firstWinner++) {
                firstPrizeWinners[i_firstWinner].transfer(prizeForEachLevel[0]);
            }
        } 
        if(countResults[1] != 0) {
            // count second prize bonus
            prizeForEachLevel[1] = highLevelBonus / 4 / countResults[1];
            for(uint i_secondWinner = 0; i_secondWinner < secondPrizeWinners.length; i_secondWinner++) {
                secondPrizeWinners[i_secondWinner].transfer(prizeForEachLevel[1]);
            }
        }
    }
    // function  testTransfer () public {
    //     address temp = firstPrizeWinners[0];
    //     temp.transfer(firstPrizeBonus * 1 ether);
    // }
    function checkPriceLevel(uint[7] memory numbers) public returns (uint)  { // done
        bool redFlag = false; 
        uint count = 0;// the number of winning blue ball
        if(numbers[0] == winnerNumbers[0]) { // win RedBall
            redFlag = true;
        }
        // todo compare array or hash of array
        // assume the blue balls are sorted in JS
        // uint i = 1;
        for(uint i = 1; i < 7; i++) {
            for(uint j = 1; j < 7; j++) {
                if(numbers[i] == winnerNumbers[j]) {
                    count++;
                }
            }
        }
        
        if(redFlag && count == 6)
            return 1;
        else if(count == 6) {
            return 2;
        } else if(redFlag && count == 5) {
            return 3;
        } 
        if(redFlag)
            count++;
        if(count == 5)
            return 4;
        else if(count == 4)
            return 5;
        else if(redFlag)
            return 6;
        return 7;
    }

    
    // make sure this contract can accept Ether
    function () payable external {
        
    }
    
   function rand(uint range) public view returns(uint) {
       uint randNouce = 0;
       uint random = uint(keccak256(abi.encodePacked(now, msg.sender, randNouce)));
       return random;
   }
   
}