const arrLength = 200;
const timer = 10;

const $id = (id) => document.getElementById(id);

const canvas = $id('canvas');
canvas.style.gridTemplateColumns = `repeat(${arrLength}, auto)`;

class Shape {
	constructor(value, index) {
        /* value: number between 0-100 */
		this.value = value;
        this.index = index;
        this.el = document.createElement('div');
        this.el.style.height = `${value}%`;
        this.move(this.index);
        canvas.appendChild(this.el);
  	}
    
    valueOf() {
    	return this.value;
    }
  
    move(index) {
        this.index = index;
        this.el.style.gridColumn = index + 1;
    }
    
    async highlight() {
    	this.el.classList.add('glo');
        await wait(timer);
        this.el.classList.remove('glo');
    }
}

class RandList {
	constructor() {
        this.init();
    }
    
    init() {
    	this.brk = true;
        while (canvas.firstChild) {
        	canvas.firstChild.remove();
        }
        this.array = new Array(arrLength);
        for (let i = 0; i < arrLength; i++) {
            this.array[i] = new Shape(randInt(100), i);
        }
        setTimeout(() => this.brk = false, 200);
    }

    swap(index1, index2) {
        this.array[index1].move(index2);
        this.array[index2].move(index1);
        [this.array[index1], this.array[index2]] = [this.array[index2], this.array[index1]];
    }
    async indexOfMin(startIndex) {
        let minIndex = startIndex;
        let minValue = this.array[minIndex];
        for (let i = minIndex + 1; i < arrLength && !this.brk; i++) {
        	await this.array[i].highlight();
            if (this.array[i] < minValue) {
                minIndex = i;
                minValue = this.array[i];
            }
        }
        return minIndex;
    }
    async insertInOrder(rightIndex, item) {
    	let i;
    	for (i = rightIndex; i >= 0 && this.array[i] > item && !this.brk; i--) {
        	await this.array[i].highlight();
        	this.array[i].move(i + 1);
        	this.array[i + 1] = this.array[i];
        }
        item.move(i + 1);
        this.array[i + 1] = item;
    }
    async mergeInOrder(lo, mid, hi) {
    	let i, j, k;
        const iMax = mid - lo + 1;
        const jMax = hi - mid;
    	const sub1 = this.array.slice(lo, mid + 1);
        const sub2 = this.array.slice(mid + 1, hi + 1);
        
        // Take lowest values of each subarray in order:
        for (i = 0, j = 0, k = lo; i < iMax && j < jMax && !this.brk; k++) {
        	await this.array[k].highlight();
        	if (sub1[i] < sub2[j]) {
            	this.array[k] = sub1[i];
                i++;
            } else {
            	this.array[k] = sub2[j];
                j++;
            }
            this.array[k].move(k);
        }
        // Once one of the subs is used up, take values from remaining sub:
        for (; i < iMax && !this.brk; i++, k++) {
        	await this.array[k].highlight();
        	this.array[k] = sub1[i];
            this.array[k].move(k);
        }
        for (; j < jMax && !this.brk; j++, k++) {
        	await this.array[k].highlight();
        	this.array[k] = sub2[j];
            this.array[k].move(k);
        }
    }
    async partition(lo, hi) {
    	const pivot = this.array[hi];
        // Move elements to left if smaller than pivot:
        let q = lo;
    	for (let i = lo; i < hi && !this.brk; i++) {
        	this.array[q].highlight();
        	await this.array[i].highlight();
        	if (this.array[i] <= pivot) {
            	this.swap(q, i);
                q++;
            }
        }
        // Move pivot to in between elements that are smaller/larger than it:
        this.swap(q, hi);
        return q;
    }
    
  
    async selectionSort() {
    	let minIndex;
        for (let i = 0; i < arrLength && !this.brk; i++) {
            minIndex = await this.indexOfMin(i);
            this.swap(i, minIndex);
        }
    }
    
    async insertionSort() {
    	for (let i = 0; i < arrLength - 1 && !this.brk; i++) {
        	await this.insertInOrder(i, this.array[i + 1]);
        }
    }
    
    async mergeSort(lo, hi) {
    	if (lo < hi && !this.brk) {
        	const mid = Math.floor((lo + hi)/2);
            await this.mergeSort(lo, mid);
            await this.mergeSort(mid + 1, hi);
            await this.mergeInOrder(lo, mid, hi);
        }
    }
    
    async quickSort(lo, hi) {
    	if (lo < hi && !this.brk) {
        	const pivotIndex = await this.partition(lo, hi);
            await this.quickSort(lo, pivotIndex - 1);
            await this.quickSort(pivotIndex + 1, hi);
        }
    }
}

let a = new RandList();

$id('reset').addEventListener('click', () => a.init());

$id('selectionSort').addEventListener('click', () => a.selectionSort());
$id('insertionSort').addEventListener('click', () => a.insertionSort());
$id('mergeSort').addEventListener('click', () => a.mergeSort(0, arrLength - 1));
$id('quickSort').addEventListener('click', () => a.quickSort(0, arrLength - 1));

function randInt(max) {
    return Math.floor(Math.random() * max);
}

function wait(delay) {
	return new Promise((resolve) => {
    	setTimeout(resolve, delay);
    });
}
