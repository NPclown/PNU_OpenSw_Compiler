import java.util.Random;

public class Main 
{
    public static void main(String[] args) 
    {
	Random r = new Random();
	int Kind = r.nextInt(4)+1;
	int rN = r.nextInt(10)+1;
	int rN2 = r.nextInt(10)+1;

	System.out.println("1. Square 2. Rectangle 3. Traingle 4. Circle");
	System.out.println("Random Number is " + Kind);
	System.out.println("============================================");

	switch(Kind){
	case 1:
		Square s1 = new Square("Square",rN);
		s1.area();
		break;
	case 2:
		Rectangle r1 = new Rectangle("Rectangle",rN,rN2);
		r1.area();
		break;
	case 3:
		Triangle t1 = new Triangle("Triangle",rN,rN2);
		t1.area();
		break;
	case 4:
		Circle c1 = new Circle("Circle",rN);
		c1.area();
		break;
	}
    }
 
}

