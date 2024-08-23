//   https://github.com/NOT2ho/notPOS_kr
var dicCSV = ''

class Node {
constructor() {
    this.child = {};
    this.output = []
    this.fail = null
    this.end = false
}
}

class AhoCorasick {
    constructor() {
        this.root = new Node();
    }

    insert(words) {
        let output = words
        let word = words[0]
        let node = this.root;
        for (let i in word) {
            const char = word[i];
            if (!node.child[char])
                node.child[char] = new Node();
            node = node.child[char];
        }
        node.output.push(output);
        node.end = true
    }


    fail() {
        const que = []
        for (const i in this.root.child) {
            this.root.child[i].fail = this.root;
            que.push(this.root.child[i]);
        
            while (que.length > 0) {
                const currentNode = que.shift();
            
                for (const i in currentNode.child) {
                    const nextNode = currentNode.child[i]

                    if (nextNode == null)
                        continue
                
                    que.push(nextNode);

                    let failNode = currentNode.fail;

                    while (failNode !== null && !failNode.child[i]) {
                        failNode = failNode.fail;
                    }
                
                    if (currentNode != this.root)

                
                        nextNode.fail = failNode ? failNode.child[i] || this.root : this.root;
                    nextNode.output = nextNode.output.concat(nextNode.fail.output);
                
                }
        
        
            }}

        }

    search(input) {
        this.fail()
        let text = input
        let result = {}
        let currentNode = this.root;
        for (let i in text) {
            const char = text[i];

            while (currentNode !== null && !currentNode.child[char]) {
                currentNode = currentNode.fail;
            }
    
            currentNode = currentNode ? currentNode.child[char] || this.root : this.root;
            for (const output of currentNode.output) {
                    result[i - output[0].length + 1] =[]
            result[i - output[0].length + 1].push(output)
            }

        }
            return result
    }
}

class Pos {
    tag = (text) => {
        const ac = new AhoCorasick()
        let res = {}
        try {
            const data = dictionary
            const pd = data.toString().split('\n')
            // console.log(pd.length)

            for (let i in pd) {
                let word = pd[i].slice(0, -1).split(',')
                ac.insert(word)
            }

            res = ac.search(text)
            let result = {}
            
            for (let i of Object.keys(res)) {
                result[i] = []
                        result[i].push(res[i][res[i].length-1])
                    }
                    
            let idx = 0
            let key = 0
            let ret = {}
            let keys = Object.keys(result)
            
        for (let i in text)
            {
                
                key = Number(keys[idx])
                if (!result[idx]) {
                    if (text[idx] != ' '){
                    ret[idx] =[text[idx], 'UNK']
                    idx++
                    }
                    else idx++
                    
                } else 
                {
                    ret[idx] = result[idx][0];
                    idx += result[idx][0][0].length
                }
                
            }
                
            let out = []
            for (let i of Object.values(ret))
                if (i[0])
                    out.push(i)
            return out
            }
                    

        
        catch (err) {
            console.error(err)
        }
    }

}

document.addEventListener("DOMContentLoaded", function() {
    const dicCSVURL = '/dic.csv';
    const dictionary = ''
    load(dicCSVURL, function (err, d) {
        dicCSV = d
        return d
        });

    hmm = new Pos();
    const txt = '머리가 조금 아프네요'
    // res = hmm.tag(txt).filter(item => item[1] === 'NN').map(item => item[0]);
    res = hmm.tag(txt)
    // console.log(res)
})