public class Triangle extends Shape{
 
    public Triangle(String name, int width, int height){
        super(name, width, height);
    }
     
    @Override
    public void area(){
        area= (width*height)/2;
        super.area();
    }
}


