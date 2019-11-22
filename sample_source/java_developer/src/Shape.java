public class Shape{
	String name;
	int width;
	int height;
	int r;
	int area;
	static final double PI = Math.PI;

	public Shape(){
	}

	public Shape(String name, int r){
		this.name = name;
		this.r = r;
	}

	public Shape(String name, int width, int height){
		this.name = name;
		this.width = width;
		this.height = height;
	}

	public void area(){
		if(r==0)
			System.out.println("height : " + height + "width : " + width + "name : " + name);
		if(r!=0)
			System.out.println("radius : " + r + "name : " + name);
		System.out.println(name + "is area : " + area);
	}
}
