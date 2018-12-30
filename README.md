# **Block** Chain Final Project

This is a demo simulating union lotto (双色球), a type of **welfare lottery** with 1 chosen blue ball and 6 chosen red balls, in real life. It aims to solve the problem of automatically computing the price of each level prize, transferring prize to the winners,  the individual income tax to tax authorities and part of income to the charity.

The main procedure of issuing a new union lotto, betting on a lotto and announcing the results is as follows:

**The main page of assigned authority**

<img src=".\imgs\authMain.png" width="800">

**The main page of betting**

<img src=".\imgs\bet.png" width="800">

**The main page of checking the result**

<img src=".\imgs\result.png" width="800">

## Background

### What is Union Lotto?

It is a lottery issued by lottery issued authority to gather some money from buyers and use 35% as donation, 49% as prize for winners. 

#### The basic rules

##### Issuing, Buying and Announcing

The buyers should choose **6** red balls from **No.1 to No. 33** and **1** blue ball from **No.1 to No.16** as a note(注) of lottery with **2 ether** per note. 

Three union lottos are issued every week with the **unique** sequence number and date when the authority will announce the results. 

##### Distribution of incomes

**Prize**: 50% of total income of a union lotto. 

**Donation**: 35% of total income of a union lotto. 

**Issuing cost**: 15% of total income of a union lotto.

****

### Why is it necessary to operating it on` ethereum`?

#### Immutability

This property of block chain guarantees the authentication and fairness of each union lotto. Once a buyer or an authority gets involved in the operation of a union lotto, all transactions will be recorded and visible for all users, which can constraint authority's behavior. (It is not a centralized contract because every account can be assigned as the authority)

#### Anonymity

Some winners of the first prize rejected their prize due to the fear that other people will know his prize and threaten him or just borrow money from him. So putting the drawing and distribution part in the block and transferring the prize to an Ethereum account will fade their worries. 

#### Automatically transferring

The trust of charity and taxation of lottery issuing authority are doubted recent years. The transferring part of the smart contract can solve this problem. Once the results comes out, the donation to charity from authorities will be transferred to assigned charity account directly, and the taxes from the winners will be transferred to tax authorities directly, which makes it get rid of the hands of a middle man, the lottery issuing authorities.

## Instruction

### Environment and Dependency

- Geth: 1.8.17-stable
- Metamask chrome extenstion: 5.2.2
- Vue, web3js, nodejs

#### Running the `geth` and starting the private chain

```shell
> geth --rpc --nodiscover --datadir data0 --port 30303 --rpcapi "db,eth,net,web3" --rpccorsdomain "*" --networkid 1001 --ipcdisable console 2>>geth.log
```

<img src=".\imgs\startGeth.png" width="800">

### Deployment of the Smart Contract `Senior Authority`

**This step only needs to be done at the first time**

The contract `SeniorAuthority` acts like the god of the union lotto world. This contract assigns who can be the authority to issue union lottos. 

The intention of setting this contract is that there're many agencies to issue lotteries all over the country right now. And it still needs some time before everyone becoming a legal lottery issuing authority, which may be realized in the future.  

This step will be done on the remix website to get the address, or in node js. 

#### Deploy with remix website

<img src=".\imgs\compiler.png" width="400">

I used this version of solidity compiler. And then the contract can be deployed in web3 provider by choosing the environment and click `Deploy` button.

<img src=".\imgs\web3provider.png" width="400">

Then the console of remix will be like follows. 

<img src=".\imgs\pendingConsole.png" width="700">

And in `geth` console, the account can be unlocked. Then the `deploy` button on the remix web page must be clicked again. 

<img src=".\imgs\unlock.png" width="700">

Then the miner can start mining until a new contract has been deployed in remix website.

<img src=".\imgs\remixDeployed.png" width="700">

Copy the address of deployed contract to `SeniorAuthority.js` and paste it. 

<img src=".\imgs\paste.png" width="700">

#### Deploy with nodejs

```powershell
> Web3 = require('web3')
> web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
> solc = require('solc')
> CONTRACT_FILE = 'SeniorAuthority.sol'
> content =fs.readFileSync(CONTRACT_FILE).toString()
> input = {
  language: 'Solidity',
  sources: {
    [CONTRACT_FILE]: {
      content: content
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
}
> compiled = solc.compile(JSON.stringify(input))
> output = JSON.parse(compiled)
> abi = output.contracts[CONTRACT_FILE]['SeniorAuthority'].abi
> bytecode = output.contracts[CONTRACT_FILE]['SeniorAuthority'].evm.bytecode.object
> bytecode = '0x'+bytecode
> SeniorAuthority = web3.eth.contract(abi)
> deployedContract = SeniorAuthority.new({from: web3.eth.accounts[0], data: bytecode, gas: 4700000})
> deployedContract.address
```

paste the return value of `deployedContract.address` to `SeniorAuthority.js`

### Starting the server on `localhost: 8080`

```
> npm start
```

input `localhost:8080` in Google Chrome, and the following page will be seen. 

<img src=".\imgs\firstPage.png" width="700">

If you haven't logged in the `MetaMask`, the main page will be like that, showing the message that you have to log in it. 

#### Connect to `geth` private chain

<img src=".\imgs\metamasknetwork.png" width="300">

Open the `MetaMask` extension, click the top-right loading progress circle and set the networks to `http://127.0.0.1:8545` which depends on the port of your local private chain. And log in with your password, and your accounts will show up. 

<img src=".\imgs\accounts.png" width="300">

Notes that I used the import function in `Metamask` to get my accounts in `geth` by `JSON` files. 

Then you can act like an authority or a buyer to interact with this DAPP. 

### As an authority

The main operation of an authority is shown in the main page, including issuing a new union  lotto by inputting the announcing date and clicking the ISSUE button. Notes that it is the **deployment** of the smart contract `UnionLotto`.

To make it clearer and easier, we assume that there's **only one** authority assigned by the senior authority. (The name of this account is `Miner&Authority`) And the authority can **issue the next union lotto only when the last union lotto is drawn**. 

And when it comes to the day of announcing the results, the authority can click the draw button to draw the results in the smart contract. At that time, the current union lotto comes to an end, and prize will be distributed automatically, and nobody can bet on an ended union lotto anymore. 

#### Main Page

The 3 buttons on the main page can achieve the main function of the authority. Notes that the test drawing button is used to assign No.1 blue ball and No.2~No.7 red ball to the result of the latest union lotto instead of generating the result randomly, which **is just used for testing**.  

<img src=".\imgs\authMain.png" width="800">

### As a buyer

#### Main Page

A buyer's main page may look like follows. Notice that there isn't issuing or drawing button. 

<img src=".\imgs\buyerMain.png" width="800">

#### Betting Page

##### Metamask part

It is a part for buyers to see their balance in real time, so the buyers don't need to click the MetaMask chrome extension to check their balance. 

<img src=".\imgs\metaMaskPart.png" width="800">

----

And the following part is the part of betting. Click one blue ball on the left part and six red balls on the right part, and then click the `bet` button. The pending circle and the transaction based on `MetaMask` will show up.

<img src=".\imgs\basicBet.png" width="800">

After clicking the `CONFIRM` in `MetaMask`, the transaction state will become pending. If `REJECT` is clicked, then the transaction will be denied, and nothing will be changed. 

<img src=".\imgs\pending.png" width="800">Then the miner has to start mining again until the state of the transaction become `CONFIRMED`. 

in `geth` command line:

```powershell
> miner.start()
```

<img src=".\imgs\confirmed.png" width="800">

Frankly speaking, in the real `Ethereum`, there're many miners mining successively. So the trouble of mining manually in `geth` command line every time after a transaction is confirmed is not inevitable anymore. 

----

If a buyer wants to buy the same set of numbers for more than 1 note, he can modify the number in the input frame and then click the `bet` button. And the `MetaMask ` will charge the buyer with corresponding amount of money. 

As in the following example, the buyer wants to buy 4 notes, and he is charged 8 ETH. 

<img src=".\imgs\EightEther.png" width="800">

#### Result Page

In the result page, it will display the bet record of current buyer. The top part is the same as that in bet page, a real-time record of account and balance of  `MetaMask` data. 

The part below the `MetaMask` is the result of current lotto. If it hasn't been drawn, there will be 7 question marks. If it has been drawn, the results will be shown.

The left column is a list of recent lottos, the yellow font color of which marks the current lotto chosen by the buyer to see the records. Click the button will change to the record of the same buyers of another union lotto. 

And the right column shows the records of each bets from current buyers of the chosen lotto from the left column. This table includes 4 columns. The first 2 columns are the chosen blue ball and red balls. The third column is the amount of bets, and the last column is the level of prize. 

**If the chosen Union Lotto hasn't been announced**

The `level of Prize` column displays `TO BE EXPECTED`. The result part displays 7 question marks.

<img src=".\imgs\notdrawResult.png" width="800">

**If the chosen Union Lotto has been announced**

The `level of Prize` column displays the result of each record. The result part displays the true result.

<img src=".\imgs\drawResult.png" width="800">

## Test Report

As mentioned in the instruction part, the one-off deployment of `SeniorAuthority` makes it possible for publishing lottos and betting without the trouble of deploying the contract by `web3` provider from `remix` website again. 

**The design of testing**

To make it convenient to prove the execution of the smart contract. The chosen numbers and bets are as follows. 

- The first account (`0x4C02D8D6CF951E636642a21F43BBB46C7fBF9342`) is assigned as the authority by the senior authority contract. And it also acts as a miner. (So the change of balance in this account is not what we are concerned of.)

- The other 7 accounts will bet the following notes: 

  | accounts name     | blue ball | red balls            | bets | expected prize level                 |
  | ----------------- | --------- | -------------------- | ---- | ------------------------------------ |
  | Buyer1            | 1         | 2, 3, 4, 5, 6, 7     | 1    | 1 (+about 741.75ether)               |
  | Buyer2            | 2         | 2, 3, 4, 5, 6, 7     | 1    | 2 (+about 247.25 ether)              |
  | Buyer3            | 1         | 8, 3, 4, 5, 6, 7     | 2    | 3 (+4 Ether * 2)                     |
  | Buyer4            | 2         | 8, 3, 4, 5, 6, 7     | 3    | 4 (+3 Ether * 3)                     |
  | Buyer5            | 2         | 8, 9, 4, 5, 6, 7     | 1    | 5 (+2 Ether)                         |
  | Buyer6            | 1         | 8, 9, 10, 11, 12, 13 | 2    | 6 (+1 Ether * 2)                     |
  | Miner & Authority | 3         | 8, 9, 10, 11, 12, 13 | 1000 | contribute the prize pool of lottery |

- Prizes:
  - Total income of this Union Lottos: 2020 ether
  - Total amount of lower level prize: $4*2+3*3+2+1*2 = 21ether$
  - Total amount of higher level prize: $total Income * 50\% - totalAmount of LowerLevelPrize = 989 ether$
  - First Prize Amount: $higherPrize * 75\% = 741.75$
  - Second Prize Amount: $higherPrize * 25\% = 247.25$
- The assigned winning numbers is: blue ball No.1, red balls No.2 to No.7

### Recording the balance of each accounts before testing

<img src=".\imgs\before1.png" width="300">

<img src=".\imgs\before2.png" width="300">

### Publish a new union lotto

#### The normal way of operation

After selecting the date and clicking the button, it will issue an union lotto. 

<img src=".\imgs\issuing.png" width="800">

Clicking the confirm in `MetaMask`. After miner mining the block, the union lotto is issued successfully.

<img src=".\imgs\betDate.png" width="800">

The betting page will show the date of announcement of current Union Lotto. 

#### The robustness of publishing procedure

- If the date field, as the key of mapping from date to Union Lotto address, is not filled, the warning message is shown and the union lotto cannot be issued. 

  <img src=".\imgs\nodate.png" width="800">

- If the last union lotto haven't been drawn, it will trigger a warning message:

  <img src=".\imgs\notdrawnyet.png" width="800">

- Apart from that, the date of the new union lotto should be later than the latest one. 

### Buy some notes of the union lottos

According to the current state, the results of buying and drawing is predicted in the table below.

| accounts name | balance after buying | prize       | expected balance after announcing |
| ------------- | -------------------- | ----------- | --------------------------------- |
| Buyer1        | 2987 ether           | 741 ether   | 3728 ether                        |
| Buyer2        | 240 ether            | 247 ether   | 487 ether                         |
| Buyer3        | 78 ether             | 4 ether * 2 | 86 ether                          |
| Buyer4        | 316 ether            | 3 ether * 3 | 325 ether                         |
| Buyer5        | 72 ether             | 2 ether * 2 | 74 ether                          |
| Buyer6        | 10 ether             | 1 ether * 2 | 12 ether                          |

#### The normal way of operation

##### Buyer1

<img src=".\imgs\bet1.png" width="600">

<img src=".\imgs\record1.png" width="600">

##### Buyer2

<img src=".\imgs\bet2.png" width="600">

<img src=".\imgs\record2.png" width="600">

##### Buyer3

<img src=".\imgs\bet3.png" width="600">

<img src=".\imgs\record3.png" width="600">

> There's a bug in the first image: the balance is shown in the unit of `wei ` which should be in the unit of `Ether`. And this bug is fixed in the final version. 

##### Buyer4

<img src=".\imgs\bet4.png" width="600">

> The highlight of blue ball No.6 is caused by mouse's hovering. 

<img src=".\imgs\record4.png" width="600">

##### Buyer5

<img src=".\imgs\bet5.png" width="600">

<img src=".\imgs\record5.png" width="600">

##### Buyer6

<img src=".\imgs\bet6.png" width="600">

<img src=".\imgs\record6.png" width="600">

##### Contributor

<img src=".\imgs\contri.png" width="600">

Notes again that this 1000 notes aim to contribute the money to the prize pool. 

#### The robustness of buying procedure

// 填写错误



### Draw the lottery

There're 2 draw buttons in the main page. One of them is for really drawing procedure where the results are drawn randomly, and the other is for assigning the result of the lotto as No.1 for one blue ball and  No.2~No.7 for red balls, which makes it convenient for testing of the drawing procedure of `UnionLotto` Contract.

In the test, I used `test` button to generate the result of Blue ball No.1, Red balls No.2 to No.7.

The record page of each buyer is as follows. 

##### Buyer1

<img src=".\imgs\result1.png" width="600">

##### Buyer2

<img src=".\imgs\result2.png" width="600">

##### Buyer3

<img src=".\imgs\result3.png" width="600">

##### Buyer4

<img src=".\imgs\result4.png" width="600">

##### Buyer5

<img src=".\imgs\result5.png" width="600">

##### Buyer6

<img src=".\imgs\result6.png" width="600">

Compare the balance of each account after the union lottos been drawn and the prize been distributed with the expected balance in the table above. I found that they are the same with gas fee ignored. 

## Room for improvement

### Assign more than one account as authority

It is mentioned above for many times. The number of authorities can be more than one by changing the authority in `SenoirAuthority` contract from `string` type to `string []`. 

### Robustness of generating a random number

As you known, the miner can control how long a block generates, which can decide the random seed of the results and indirectly influence the results of a union lotto. I've found a method of generating it randomly published by Oracle, but failed in applying it on my project.

### Assign the account of Tax Authorities and Charities in the contract

This function is easier than transferring the prize of the winners as long as we can get their account address. However, we have to secretly assign it without publishing it to the public to observe the anonymity of blockchain. 

### Transfer money as prize pool to the Union Lotto contract once it is created

I have to admit that it is a necessary function but I don't have enough time to implement and test it. But in the rule of union lotto, prize pool is required. 

### Change the price of each notes based on real-time exchange rate

I have to add another interface to interact with exchange rate provider, and poll it's data every small time slot to get the "real time" data. 

## Bugs Avoidance

##### [ethjs-rpc] rpc error with payload Error: invalid sender(on MetaMask)

https://blog.csdn.net/laixide110/article/details/83895013

##### CALL_AND_RETRY_LAST Allocation failed (on `npm start`)

https://blog.csdn.net/liub37/article/details/82866763

## References

- frame: Vue + web3js + metamask - https://itnext.io/create-your-first-ethereum-dapp-with-web3-and-vue-js-c7221af1ed82
- pending animation - https://codepen.io/luka-butina/pen/ZbeQzd
- button of homepage - https://codepen.io/nakome/pen/AELuF
- UI design - https://dribbble.com/shots/4681011-Blockchain-Lottery-Profile-My-tickets
- The tutorial of `MetaMask` - https://www.jianshu.com/p/b5b2c05e9090