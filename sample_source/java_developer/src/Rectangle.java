public class Rectangle extends Shape{
	public Rectangle(String name, int width, int height){
		super(name,width,height);
	}

	public void area(){
		area = (width*height);
		super.area();
	}
}
